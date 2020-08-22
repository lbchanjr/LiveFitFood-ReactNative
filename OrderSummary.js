import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, FlatList, Platform, TextInput, View, Text, Image} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import {db, auth} from './firebaseConfig'

export default function OrderSummary({navigation, route}) {

    const [orders, setOrders] = useState([]);

    useEffect(() => {
        console.log("Retrieving orders from firebase...")
        db.collection('orders')
        .get()
        .then(querySnapshot => {
            console.log('Total Order size: ', querySnapshot.size);
            const orderArray = [];
            querySnapshot.forEach(documentSnapshot => {
                const docData = documentSnapshot.data();
                if (docData.customerEmail === auth.currentUser.email) {
                    const orderInfo = {mealPackage: docData.mealPackage, orderCode: docData.orderCode, amountPaid: docData.amountPaid, customerEmail: docData.customerEmail, customerName: docData.customerName, dateTime: docData.dateTime}
                    orderArray.push(orderInfo);    
                }
            });
            setOrders(orderArray);
        }) 
        .catch(error=> {
            console.log("Error in retrieving firestore data")
            console.error(error)
        });    
    }, []);
    
    console.log("params passed: " + JSON.stringify(route.params));

    const renderItem = ({item}) => {
        return (
            <View style={styles.orders} key={item.orderCode}>
                <Text style={{marginHorizontal: 5, fontSize: 12, fontWeight: 'bold'}}>Order #: {item.orderCode}</Text>
                <Text style={{marginHorizontal: 5, fontSize: 12, fontWeight: 'bold'}}>Date: {item.dateTime}</Text>
                <Text style={{marginHorizontal: 5, fontSize: 12, fontWeight: 'bold'}}>Meal kit: {item.mealPackage} Package</Text>
                <Text style={{marginHorizontal: 5, fontSize: 12, fontWeight: 'bold'}}>Total amount paid: ${item.amountPaid}</Text>
            </View>   
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{marginVertical: 15, fontSize: 23, fontWeight: "bold", textAlign: "center"}}>Thank you for shopping at Live Fit Food.</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('MainScreen', {name: auth.currentUser.displayName, email: auth.currentUser.email})}>
                <Text style={{borderWidth: 1, borderRadius: 3, marginBottom: 5, paddingHorizontal: 20, paddingVertical:3, backgroundColor:'lightgray'}}>Return to Main Menu</Text>
            </TouchableOpacity>

            <Text style={{marginVertical: 15, fontSize: 18, fontWeight: "bold", textAlign: "center"}}>ORDER HISTORY</Text>
        
            <FlatList style={{width:"100%"}}
                data = {orders}
                renderItem = {renderItem}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffd0a1',
      alignItems: 'center',
      //justifyContent: 'center',
    },
    orders: {
        flex: 1,
        justifyContent:"space-between",
        flexDirection: 'column',
        flexWrap: 'wrap',
        backgroundColor: "#ffe8d1",
        borderWidth: 1,
        //borderRadius: 5,
        marginVertical: 2,
        marginHorizontal: 3,
    }
});