import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import { Card, Header, Icon, ListItem } from 'react-native-elements'
import SwipeableFlatlist from '../components/SwipeableFlatlist'
import { RFValue } from 'react-native-responsive-fontsize'

export default class NotificationScreen extends Component{
    constructor(){
        super();
        this.state={
            userId:firebase.auth().currentUser.email,
            receivedItemsList:[]
        }
        this.requestRef=null
    }

    getReceivedItemsList=()=>{
        this.requestRef=db.collection('requested_items')
        .where('user_id', '==', this.state.userId)
        .where("item_status", '==', 'received')
        .onSnapshot((snapshot) =>{
           var receivedItemsList=snapshot.docs.map((doc)=>doc.data())
           this.setState({
               receivedItemsList:receivedItemsList
           })
        })
    }

    keyExtractor=(item, index)=>index.toString()

    renderItem=({item, i})=>(
        <ListItem
        key={i}
        title={item.item_name}
        leftElement={
            <Image
            style={{height:RFValue(50), width:RFValue(50)}}
            source={{
                uri:item.image_link
            }}/>
        }
        titleStyle={{color:'black', fontWeight:'bold'}}
        subtitle={item.itemStatus}
        bottomDivider
        />
    )

    componentDidMount(){
        this.getReceivedItemsList()
    }
    componentWillUnmount(){
        this.requestRef
    }

    render(){
        return(
            <View style={{flex:1}}>
                <View style={{flex:0.1}}>
                    <MyHeader title={"Received Items"} navigation={this.props.navigation}/>
                </View>
            
                <View style={{flex:0.9}}>
                        {
                            this.state.receivedItemsList.length===0
                            ?(
                                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{fontSize:20}}>List of all received items</Text>
                                </View>
                            ):(
                                <FlatList
                                keyExtractor={this.keyExtractor}
                                data={this.state.receivedItemsList}
                                renderItem={this.renderItem}
                                />
                            )
                        }
                </View>
            </View>
        )
    }
}

