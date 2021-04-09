import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import WelcomeScreen from '../screens/WelcomeScreen'
import ItemRequestScreen from '../screens/ItemRequestScreen'
import ItemDonateScreen from '../screens/ItemDonateScreen'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { AppStackNavigator } from './AppStackNavigator'

export const AppTabNavigator= createBottomTabNavigator({
    DonateItems:{
        screen:AppStackNavigator,
        navigationOptions:{
            tabBarLabel: "Donate Items"
        }
    },
    ItemRequest:{
        screen:ItemRequestScreen,
        navigationOptions:{
            tabBarLabel: "Item Request"
        }
    }
    
})