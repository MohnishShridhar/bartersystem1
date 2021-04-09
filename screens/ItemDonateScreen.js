import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import { ListItem } from 'react-native-elements'

export default class ItemDonateScreen extends Component{
    constructor(){
        super();
        this.state={
            userid:firebase.auth().currentUser.email,
            requestedItemsList:[]
        }
        this.requestRef=null
    }
    getRequestedItemsList=()=>{
        this.requestRef=db.collection("requested_items")
        .onSnapshot((snapshot)=>{
            var requestedItemsList=snapshot.docs.map(document=>document.data());
            this.setState({
                requestedItemsList:requestedItemsList
            })
        })
    }
    componentDidMount(){
        this.getRequestedItemsList()
    }
    componentWillUnmount(){
        this.requestRef()
    }
    keyExtractor=(item, index)=>index.toString()
    renderItem=({item, i})=>{
        return(
            <ListItem
            key={i}
            title={item.item_name}
            subtitle={item.reason_to_request}
            titleStyle={{color:'black', fontWeight:'bold'}}
            leftElement={
            <Image style={{height:50, width:50}}
            source={{uri:item.image_link}}
            />
            }
            rightElement={
                <TouchableOpacity style={styles.button}
                    onPress={()=>{
                        this.props.navigation.navigate("ReceiverDetails", {details: item})
                    }}
                >

                    <Text style={{color:'#ffff'}}>View</Text>
                </TouchableOpacity>
            }
            bottomDivider/>
        )
    }
    render(){
        return(
            <View style={{flex:1}}>
                <MyHeader title="Donate Items"/>
                <View style={{flex:1}}>
                    {
                        this.state.requestedItemsList.length==0
                        ?(
                            <View style={styles.subContainer}>
                                <Text style={{fontSize:20}}>List of all requested items</Text>
                            </View>
                        ):(
                            <FlatList
                            keyExtractor={this.keyExtractor}
                            data={this.state.requestedItemsList}
                            renderItem={this.renderItem}
                            />
                        )
                    }
                </View>
            </View>
        )
    }
}
const styles=StyleSheet.create({
    button:{
        width:100,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor:'#ff9800',
        shadowColor:"#000",
        shadowOffset:{
            width:0,
            height:8
        },
    },
    subContainer:{
        flex:1,
        fontSize:20,
        justifyContent:'center',
        alignItems:'center'
    }
})