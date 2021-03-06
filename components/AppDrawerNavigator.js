import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingScreen from '../screens/SettingScreen';
import MyDonationsScreen from '../screens/MyDonationsScreen';
import NotificationScreen from '../screens/NotificationScreen';
import MyReceivedItemsScreen from '../screens/MyReceivedItemsScreen';
import { Icon } from 'react-native-elements';

export const AppDrawerNavigator= createDrawerNavigator({
    Home:{     
        screen:AppTabNavigator,
        navigationOptions:{
            drawerIcon:<Icon name="home" type="fontawesome5"/>
        }
    },
    MyDonations:{
        screen:MyDonationsScreen,
        navigationOptions:{
            drawerIcon:<Icon name="gift" type="font-awesome"/>,
            drawerLabel:"My Donations"
        }
    },
    MyReceivedItems:{
        screen:MyReceivedItemsScreen,
        navigationOptions:{
            drawerIcon:<Icon name="gift" type="font-awesome"/>,
            drawerLabel:"My Received Items"
        }
    },
    Setting:{
        screen:SettingScreen,
        navigationOptions:{
            drawerIcon:<Icon name="settings" type="fontawesome5"/>,
            drawerLabel:"Settings"
        }
    },
    Notification:{
        screen:NotificationScreen,
        navigationOptions:{
            drawerIcon:<Icon name="bell" type="font-awesome"/>,
            drawerLabel:"Notifications"
        }
    }
},
{
    contentComponent: CustomSideBarMenu
},
{
    initialRouteName:'Home'
})