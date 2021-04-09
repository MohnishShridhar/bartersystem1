import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, ScrollView } from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import { Card, Header, Icon } from 'react-native-elements'

export default class ReceiverDetailsScreen extends Component{
    constructor(props){
        super(props);
        this.state={
            userId:firebase.auth().currentUser.email,
            receiverId:this.props.navigation.getParam('details')["user_id"],
            requestId:this.props.navigation.getParam('details')["request_id"],
            itemName:this.props.navigation.getParam('details')["item_name"],
            reason_for_requesting:this.props.navigation.getParam('details')["reason_to_request"],
            recieverName:'',
            receiverContact:'',
            receiverAddress:'',
            receiverRequestDocId:''
        }
    }
    getReceiverDetails(){
        db.collection('users').where('email_id', '==', this.state.receiverId).get()
        .then(snapshot =>{
            snapshot.forEach(doc=>{
                var data=doc.data()
                this.setState({
                    receiverName:data.last_name,
                    receiveraddress:data.address,
                    receivercontact:data.contact,
                })
            })
        })
        db.collection('requested_items').where('request_id', '==', this.state.requestId).get()
        .then(snapshot =>{
            snapshot.forEach(doc=>{
                this.setState({
                    receiverRequestDocId:doc.id
                })
            })
        })
    }

    getUserDetails=()=>{
        db.collection('users').where('email_id', '==', email).get()
        .then(snapshot =>{
            snapshot.forEach(doc=>{
                var data=doc.data()
                this.setState({
                    userName:doc.data().first_name+" "+doc.data().last_name
                })
            })
        })
    }
    
    addNotification=()=>{
        var message=this.state.userName+" has shown interest in donating the item"
        db.collection("all_notifications").add({
            "target_user_id":this.state.receiverId,
            "donor_id":this.state.userId,
            "request_id":this.state.requestId,
            "item_name":this.state.itemName,
            "date":firebase.firestore.FieldValue.serverTimestamp(),
            "notification_status":"unread",
            "message":message
        })
    }

    componentDidMount(){
        this.getReceiverDetails()
        this.getUserDetails(this.state.userId)
    }

    updateItemStatus=()=>{
        db.collection('all_donations').add({
            item_name:this.state.itemName,
            request_id:this.state.requestId,
            requested_by:this.state.receiverName,
            donor_id:this.state.userId,
            request_status:'donor interested'
        })
    }

    componentDidMount(){
        this.getReceiverDetails()
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={{flex:0.1}}>
                    <Header
                    leftComponent={<Icon name='arrow-left' type='feather' color='#696969' onPress={()=>{this.props.navigation.goBack()}}/>}
                    centerComponent={{text:"Donate Items", style:{color:'#90a5a9', fontSize:20, fontWeight:"bold"}}}
                    backgroundColor="#eaf8fe"
                    />
                </View>
                <View style={{flex:0.3}}>
                    <Card
                    title={"Item Information"}
                    titleStyle={{fontSize:20}}>
                        <Card>
                            <Text style={{fontWeight:'bold'}}>Name:{this.state.itemName}</Text>
                        </Card>
                        <Card>
                            <Text style={{fontWeight:'bold'}}>Reason:{this.state.reason_for_requesting}</Text>
                        </Card>
                    </Card>
                </View>
                <View style={{flex:0.3}}>
                    <Card
                    title={"Receiver Information"}
                    titleStyle={{fontSize:20}}>
                        <Card>
                            <Text style={{fontWeight:'bold'}}>Name:{this.state.receiverName}</Text>
                        </Card>
                        <Card>
                            <Text style={{fontWeight:'bold'}}>Contact:{this.state.receiverContact}</Text>
                        </Card>
                        <Card>
                            <Text style={{fontWeight:'bold'}}>Address:{this.state.receiverAddress}</Text>
                        </Card>
                    </Card>
                </View>
                <View style={styles.buttonContainer}>
                    {this.state.receiverId!==this.state.userId
                    ?(
                        <TouchableOpacity
                        style={styles.button}
                        onPress={()=>{
                            this.updateItemStatus()
                            this.addNotification()
                            this.props.navigation.navigate('MyDonations')
                        }}>
                            <Text>I want to donate</Text>
                        </TouchableOpacity>
                    ):(null)}
                </View>
            </View>
        )
    }
}

const styles= StyleSheet.create({
    container:{
        flex:1
    },
    buttonContainer:{
        flex:0.3,
        justifyContent:'center',
        alignItems:'center'
    },
    button:{
        width:200,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:'orange',
        shadowColor:"#000",
        shadowOffset:{
            width:0,
            height:8
        },
        elevation:16
    }
})