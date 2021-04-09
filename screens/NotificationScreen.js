import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, KeyboardAvoidingView, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import { Card, Header, Icon, ListItem } from 'react-native-elements'
import SwipeableFlatlist from '../components/SwipeableFlatlist'

export default class NotificationScreen extends Component{
    constructor(props){
        super(props);
        this.state={
            userId:firebase.auth().currentUser.email,
            allNotifications:[]
        }
        this.notificationRef=null
    }

    getNotifications=()=>{
        this.notificationRef=db.collection('all_notifications')
        .where('notification_status', '==', "unread")
        .where("target_user_id", '==', this.state.userId)
        .onSnapshot((snapshot) =>{
           var allNotifications=[]
           snapshot.docs.map((doc)=>{
               var notification=doc.data();
               notification["doc_id"]=doc.id
               allNotifications.push(notification)
           });
           this.setState({
               allNotifications:allNotifications
           })
        })
    }

    keyExtractor=(item, index)=>index.toString()

    renderItem=({item, i})=>(
        <ListItem
        key={i}
        title={item.item_name}
        leftElement={<Icon name="item" type="font-awesome" color="#696969"/>}
        titleStyle={{color:'black', fontWeight:'bold'}}
        subtitle={item.message}
        bottomDivider
        />
    )

    componentDidMount(){
        this.getNotifications()
    }
    componentWillUnmount(){
        this.notificationRef()
    }

    render(){
        return(
            <View style={{flex:1}}>
                <View style={{flex:0.1}}>
                    <MyHeader title={"Notification"} navigation={this.props.navigation}/>
                </View>
            
                <View style={{flex:0.9}}>
                        {
                            this.state.allNotifications.length===0
                            ?(
                                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                                    <Text style={{fontSize:20}}>You have no notifications</Text>
                                </View>
                            ):(
                                <SwipeableFlatlist allNotifications={this.state.allNotifications}/>
                            )
                        }
                </View>
            </View>
        )
    }
}

