import React, { Component } from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingScreen from '../screens/SettingScreen';
import MyDonationsScreen from '../screens/MyDonationsScreen'
import NotificationScreen from '../screens/NotificationScreen'
import { ListItem, Icon } from 'react-native-elements';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SwipeListView } from 'react-native-swipe-list-view';
import db from '../config';

export default class SwipeableFlatlist extends Component{
    constructor(props){
        super(props);
        this.state={
            allNotifications:this.props.allNotifications
        }
    }

    updateMarkAsRead=(notification)=>{
        db.collection("all_notifications").doc(notification.doc_id).update({
            "notification_status":"read"
        })
    }

    onSwipeValueChange=swipeData=>{
        var allNotifications=this.state.allNotifications
        const{key, value}=swipeData;

        if(value<-Dimensions.get('window').width){
            const newData=[...allNotifications];
            const previousIndex=allNotifications.findIndex(item=>item.key===key);
            this.updateMarkAsRead(allNotifications[previousIndex]);
            newData.splice(previousIndex, 1);
            this.setState({allNotifications:newData})
        }
    }

    renderItem=data=>(
        
        <ListItem
        title={data.item.Item_name}
        leftElement={<Icon name="Item" type="font-awesome" color="#696969"/>}
        titleStyle={{color:'black', fontWeight:'bold'}}
        subtitle={data.item.message}
        bottomDivider
        />
    
    )

    renderHiddenItem=()=>{
        <View style={styles.rowBack}>
            <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
                <Text style={styles.backTextWhite}></Text>
            </View>
        </View>
    }

    render(){
        return(
            <View style={styles.container}>
                <SwipeListView
                data={this.state.allNotifications}
                renderItem={this.renderItem}
                renderHiddenItem={this.renderHiddenItem}
                rightOpenValue={-Dimensions.get('window').width}
                previewOpenValue={-40}
                previewRowKey={'0'}
                previewOpenDelay={3000}
                onSwipeValueChange={this.onSwipeValueChange}
                />
            </View>
        )
    }
}

const styles=StyleSheet.create({
    container:{
        backgroundColor:'white',
        flex:1
    },
    backTextWhite:{
        color:'#ffff',
        fontWeight:'bold',
        fontSize:15
    },
    rowBack:{
        alignItems:'center',
        backgroundColor:'#29b6f6',
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingLeft:15
    },
    backRightBtn:{
        alignItems:'center',
        bottom:0,
        justifyContent:'center',
        position:'absolute',
        top:0,
        width:100
    },
    backRightBtnRight:{
        backgroundColor:'#29b6f6',
        right:0
    }
})