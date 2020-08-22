
import { NavigationContainer} from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack'

//import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Platform, Image } from 'react-native';

import UserLogin from './UserLogin'
import RegisterUser from './RegisterUser'
import MainScreen from './MainScreen'
import MealScreen from './MealsDisplay'
import ConfirmPurchase from './ConfirmBuy'
import OrderSummary from './OrderSummary'
//import { TouchableOpacity } from "react-native-gesture-handler";

const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="UserLogin" 
          component={UserLogin}
          options={{title: '', 
              headerLeft: ()=> {
              return (
                <View style={styles.header}>
                <Image style= {{marginLeft: 20, width: 40, height: 40}}source={require("./assets/livefitfood.png")}/>
                <Text style={{marginLeft: 10, color: "white", fontWeight: "bold", fontSize: 20}}>Live Fit Food</Text>
                </View>
              )},
              headerStyle: {backgroundColor: '#e30057'}, 
              headerTintColor: '#FFF',
              headerTitleStyle: {fontWeight: 'bold'},
              cardStyle: {width: Platform.OS==="web"?600:"100%", alignSelf:"center", margin: 20}}}
        />
        <Stack.Screen name="RegisterUser" 
          component={RegisterUser}
          options={{title: 'User Registration', 
          headerStyle: {backgroundColor: '#e30057'}, 
          headerTintColor: '#FFF',
          headerTitleStyle: {fontWeight: 'bold', textAlign: 'center'},
          cardStyle: {width: Platform.OS==="web"?600:"100%", alignSelf:"center", margin: 20}}}
        />
        <Stack.Screen name="MainScreen" 
        component={MainScreen}
        options={{title: 'Welcome to Live Fit Foods', 
        headerLeft: null,
          headerStyle: {backgroundColor: '#e30057'}, 
          headerTintColor: '#FFF',
          headerTitleStyle: {fontWeight: 'bold', textAlign: 'center'},
          cardStyle: {width: Platform.OS==='web' ? 600: '100%', alignSelf:'center', margin: 20},
          }}
        />

        <Stack.Screen name="MealScreen" 
        component={MealScreen}
        options={{title: 'Meals available for this package', 
          headerStyle: {backgroundColor: '#e30057'}, 
          headerTintColor: '#FFF',
          headerTitleStyle: {fontWeight: 'bold', textAlign: 'center'},
          cardStyle: {width: Platform.OS==='web' ? 600: '100%', alignSelf:'center', margin: 20},
          }}
        />

        <Stack.Screen name="ConfirmPurchase" 
        component={ConfirmPurchase}
        options={{title: 'Confirm Your Purchase', 
          headerStyle: {backgroundColor: '#e30057'}, 
          headerTintColor: '#FFF',
          headerTitleStyle: {fontWeight: 'bold', textAlign: 'center'},
          cardStyle: {width: Platform.OS==='web' ? 600: '100%', alignSelf:'center', margin: 20},
          }}
        />

        <Stack.Screen name="OrderSummary" 
        component={OrderSummary}
        options={{title: 'Order Summary',
          headerLeft: null,
          headerStyle: {backgroundColor: '#e30057'}, 
          headerTintColor: '#FFF',
          headerTitleStyle: {fontWeight: 'bold', textAlign: 'center'},
          cardStyle: {width: Platform.OS==='web' ? 600: '100%', alignSelf:'center', margin: 20},
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  }
});
