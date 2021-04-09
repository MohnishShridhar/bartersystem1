import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import ItemDonateScreen from '../screens/ItemDonateScreen';
import ReceiverDetailsScreen from '../screens/ReceiverDetailsScreen';

export const AppStackNavigator= createStackNavigator({
    ItemDonateList:{
        screen:ItemDonateScreen,
        navigationOptions:{
            headerShown:false
        }
    },
    ReceiverDetails:{
        screen:ReceiverDetailsScreen,
        navigationOptions:{
            headerShown:false
        }
    },
    },
    {
        initialRoute:'ItemDonateList'
    }
)