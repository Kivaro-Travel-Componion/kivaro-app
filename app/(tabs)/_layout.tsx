import React from 'react'
import { Tabs } from 'expo-router'
import { Image, View } from 'react-native'
import { icons } from '@/constants/icons'

const TabIcon = ({ icon, focused }: TabIconProp) => {
    return (
        <View>
            <View>
                <Image source={icon} resizeMode='contain'  style={[{ tintColor: focused ? '#2B8CEE' : '#94A3B8' }]}/>
            </View>
        </View>
    );
}

export default function TabLayout() {
  return (
    <Tabs
        screenOptions={{
            tabBarItemStyle: {
                width: '100%',
                height: '100%',
                marginTop: 8
            },
            tabBarStyle: {
                borderRadius: 50,
                marginHorizontal: 10,
                marginBottom: 40,
                height: 74,
                position: 'absolute',
                overflow: 'hidden',
                borderWidth: 1
            },
            tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: 'bold',
            },
            tabBarActiveTintColor: '#2B8CEE',
            tabBarInactiveTintColor: '#94A3B8',
        }}
    >
        <Tabs.Screen 
            name='index'
            options={{
                title: 'Home', 
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon icon={icons.home} focused={focused} />
                )
            }}
        />
        <Tabs.Screen 
            name='explore'
            options={{
                title: 'Explore', 
                headerShown: false,
                 tabBarIcon: ({ focused }) => (
                    <TabIcon icon={icons.explore} focused={focused} />
                )
            }}
        />
        <Tabs.Screen 
            name='trips'
            options={{
                title: 'Trips', 
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon icon={icons.trips} focused={focused} />
                )
            }}
        />
        <Tabs.Screen 
            name='profile'
            options={{
                title: 'Profile', 
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon icon={icons.profile} focused={focused}/>
                )
            }}
        />
    </Tabs>
  )
}