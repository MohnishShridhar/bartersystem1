import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader';
import ItemSearch from 'react-native-google-books'
import { TouchableHighlight, FlatList } from 'react-native-gesture-handler';

export default class ItemRequestScreen extends Component{
    constructor(){
        super();
        this.state={
            userId:firebase.auth().currentUser.email,
            itemName:"",
            reasonToRequest:"",
            isItemRequestActive:"",
            requestedItemName:"",
            itemStatus:"",
            requestId:"",
            userDocId:'',
            docId:'',
            imageLink:'',
            dataSource:"",
            showFlatlist:false
        }
    }

    createUniqueId(){
        return Math.random().toString(36).substring(7);
    }

    receivedItems=(itemName)=>{
        var userId=this.state.userId
        var requestId=this.state.requestId
        db.collection('received_items').add({
            "user_id":userId,
            "item_name":itemName,
            "request_id":requestId,
            "itemStatus":"received"
        })
    }

    getIsItemRequestActive(){
        db.collection('users').where('email_id', '==', this.state.userId)
        .onSnapshot(querySnapshot=>{
            querySnapshot.forEach(doc=>{
                this.setState({
                    isItemRequestActive:doc.data().isItemRequestActive,
                    userDocId:doc.id
                })
            })
        })
    }

    getItemRequest=()=>{
        var itemRequest= db.collection('requested_items').where('user_id', '==', this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                if(doc.data().item_status!=="received"){
                    this.setState({
                        requestId:doc.data().request_id,
                        requestedItemName:doc.data().item_name,
                        itemStatus:doc.data().item_status,
                        docId:doc.id
                    })
                }
            })
        })
    }

    sendNotification=()=>{
        db.collection('users').where('email_id', '==', this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var name=doc.data().first_name
                var lastName=doc.data().last_name
                db.collection('all_notifications')
        .where("request_id", "==", this.state.requestId)
        .get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var donorId=doc.data().donor_id
                var itemName=doc.data().item_name
                db.collection("all_notifications").doc(doc.id).update({
                    "targeted_user_id":donorId,
                    "message":name + " " + lastName + " received the item " + itemName,
                    "notification_status":"unread",
                    "item_name":itemName
                })
            })
        })
            })
            
        })
        
    }

    componentDidMount(){
        this.getItemRequest()
        this.getIsItemRequestActive()
    }

    updateItemrequestStatus=()=>{
        db.collection('requested_items').doc(this.state.docId).update({
            item_status:'received'
        })
        db.collection('users').where('email_id', '==', this.state.userId).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection('users').doc(doc.id).update({
                    isItemRequestActive:false
                })
            })
        })
    }

    addRequest=async(itemName, reasonToRequest)=>{
        var userId=this.state.userId
        var randomRequestId=this.createUniqueId()
        var items=await ItemSearch.ItemSearch.searchitem(itemName, 'AIzaSyB93dDD8YeW1zfAnBVjpkuj7ERFbx17M80')
        db.collection('requested_items').add({
            "user_id": userId,
            "item_name": itemName,
            "reason_to_request":reasonToRequest,
            "request_id":randomRequestId,
            "item_status":"requested",
            "date":firebase.firestore.FieldValue.serverTimestamp(),
            "image_link":items.data[0].volumeInfo.imageLinks.smallThumbnail
            })
            await this.getItemRequest()
            db.collection('users').where("email_id", "==", userId).get()
            .then()
            .then((snapshot)=>{
                snapshot.forEach((doc)=>{
                    db.collection('users').doc(doc.id).update({
                        isItemRequestActive:true
                    })
                })
            })
        this.setState({
            itemName:'',
            reasonToRequest:'',
            requestId:randomRequestId
        })
        return alert('Item Requested Successfully')
    }

    async getItemsFromApi(itemName){
        this.setState({itemName:itemName})
        if(itemName.length>2){
            var items= await ItemSearch.ItemSearch.searchitem(itemName, 'AIzaSyB93dDD8YeW1zfAnBVjpkuj7ERFbx17M80')
            this.setState({
                dataSource:items.data,
                showFlatlist:true
            })
        }
    }

    renderItem=({item, i})=>{
        let obj={
            title:item.volumeInfo.title,
            selfLink:item.selfLink,
            buyLink:item.saleInfo.buyLink,
            imageLink:item.volumeInfo.imageLinks
        }

        return(
            <TouchableHighlight
            style={{alignItems:"center", backgroundColor:"#ddddd", padding:10, width:'90%'}}
            activeOpacity={0.6}
            underlayColor="#ddddd"
            onPress={()=>{
                this.setState({
                    showFlatlist:false,
                    itemName:item.volumeInfo.title
                })
            }}
            bottomDivider>
                <Text>{item.volumeInfo.title}</Text>
            </TouchableHighlight>
        )
    }

    render(){
        if(this.state.isItemRequestActive===true){
            return(
                <View style={{flex:1, justifyContent:'center'}}>
                    <View style={{borderColor:"orange", borderWidth:2, justifyContent:'center', alignItems:'center', padding:10, margin:10}}>
                        <Text>Item name</Text>
                        <Text>{this.state.requestedItemName}</Text>
                    </View>
                    <View style={{borderColor:"orange", borderWidth:2, justifyContent:'center', alignItems:'center', padding:10, margin:10}}>
                        <Text>Item status</Text>
                        <Text>{this.state.itemStatus}</Text>
                    </View>
                    <TouchableOpacity
                    style={{borderColor:"orange", backgroundColor:"orange", borderWidth:1, justifyContent:'center', alignItems:'center', alignSelf:'center', width:300, height:30, marginTop:30}}
                    onPress={()=>{
                        this.sendNotification()
                        this.updateItemrequestStatus()
                        this.receivedItems(this.state.requestedItemName)
                    }}>
                        <Text>I received the item!</Text>
                    </TouchableOpacity>

                </View>
            )
        } else{
            return(
                
                <View style={{flex:1}}>
                    <MyHeader title="Request Items" navigation={this.props.navigation}/>
                    <KeyboardAvoidingView style={styles.keyboardStyle}>
                        <TextInput
                        syle={styles.formTextInput}
                        placeholder={"Enter Item Name"}
                        onChangeText={(text)=>{
                            this.getItemsFromApi(text)
                        }}
                        onClear={text=>this.getItemsFromApi("")}
                        value={this.state.itemName}
                        />
                        {
                            this.state.showFlatlist?
                            (
                                <FlatList
                                data={this.state.dataSource}
                                renderItem={this.renderItem}
                                enableEmptySections={true}
                                style={{marginTop:10}}
                                keyExtractor={(item, index)=>index.toString()}
                                />
                            )
                            :(
                                <View style={{alignItems:'center'}}>
                                    <TextInput
                                    style={[styles.formTextInput, {height:300}]}
                                    multiline
                                    numberOfLines={8}
                                    placeholder={"Why do you need the item?"}
                                    onChangeText={(text)=>{
                                        this.setState({reasonToRequest:text})
                                    }}
                                    value={this.state.reasonToRequest}
                                    />
                                    <TouchableOpacity
                                    style={styles.button}
                                    onPress={()=>{
                                        this.addRequest(this.state.itemName, this.state.reasonToRequest)
                                    }}>
                                        <Text>Request</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    </KeyboardAvoidingView>
                </View>
            )
        }
    }
}

const styles=StyleSheet.create({
    keyboardStyle:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    formTextInput:{
        width:'75%',
        height:35,
        alignSelf:'center',
        borderColor:'#ffab91',
        borderRadius:10,
        borderWidth:1,
        marginTop:20,
        padding:10
    },
    button:{
        width:"75%",
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:'#ff9800',
        shadowColor:"#000",
        shadowOffset:{
            width:0,
            height:8
        },
        shadowOpacity:0.30,
        shadowRadius:10.32,
        elevation:16,
        marginTop:20
    },
})