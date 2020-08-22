import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, FlatList, Platform, TextInput, View, Text, Image, Picker} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {db, auth} from './firebaseConfig'

export default function ConfirmPurchase({navigation, route}) {

    
    const generateSKU = () => {
        let sku = route.params.mealKit.replace(' ', '').toUpperCase();

        for (let i = 0; i < 10; i++) {
            const num = Math.floor(Math.random() * 10);
            sku = sku + `${num}`
        }

        console.log("SKU generated is: " + sku)
        return sku
    }

    const [sku, setSku] = useState(generateSKU());
    const [tip, setTip] = useState(10);
    const [tipAmount, setTipAmount] = useState(0);
    const dateTime = new Date();
    const [dateStamp, setDateStamp] = useState(dateTime.toLocaleString());
    const [grandTotal, setGrandTotal] = useState(0);
    
    const tax = (route.params.price*0.13).toFixed(2);
    const subtotal = Number(tax) + Number(route.params.price);
    //const tipAmount = Number(route.params.price) * (Number(tip)/100);

    useEffect(()=>{
        const tipMoney = Number(route.params.price) * (Number(tip)/100);
        setTipAmount(tipMoney.toFixed(2))
    },[tip]);

    useEffect(()=> {
        setGrandTotal((Number(route.params.price) + Number(tax) + Number(tipAmount)).toFixed(2));
    }, [tipAmount])

    return (
        <SafeAreaView style={styles.container}>
            {/* <Text style={{textAlign: "center", alignSelf: "center", marginVertical: 10, fontSize: 23, fontWeight: "bold"}}>Please check your purchase and confirm</Text> */}
            <Text style={[styles.header, {marginTop: 15}]}>Meal kit name: {route.params.mealKit} Package </Text>
            <Text style={styles.header}>Order #: {sku}</Text>
            <Text style={[styles.header, {marginBottom: 15}]}>Order date: {dateStamp}</Text>
            <ListItem left="Price:" right={`$${route.params.price.toFixed(2)}`} rightAlign="right"/>
            <ListItem left="Tax (13%HST):" right={`$${tax}`} rightAlign="right"/>
            <ListItem left="Subtotal:" right={`$${subtotal.toFixed(2)}`} rightAlign="right"/>

            <View style={{flexDirection:"row"}}>
                <Text style={[styles.listLeft, {marginLeft:15, marginTop:5}]}>Tip: </Text>
                <Picker 
                    selectedValue={tip}
                    itemStyle={styles.onePickerItem}
                    style={{marginTop:Platform.OS==='ios'?0:5, height:20, width:100}}
                    onValueChange={(itemValue)=>{
                        //console.log("item value: " + itemValue + "amout")
                        setTip(itemValue)
                    }}
                >
                    <Picker.Item label="10%" value="10" />
                    <Picker.Item label="15%" value="15" />
                    <Picker.Item label="20%" value="20" />
                </Picker>
                <TextInput style={{fontSize: 15, textAlign: "right", marginTop: 5, flex:2, width: 200, marginRight: 15, borderWidth:1}}
                keyboardType="number-pad"
                onChangeText={(val)=>setTipAmount(val.trim())}
                value={tipAmount} />
                {/* <Text style={{fontSize: 15, textAlign: "right", marginTop: 5, flex: 2, marginRight: 15}}>${tipAmount.toFixed(2)}</Text> */}
            </View>

            <ListItem left="Grand Total:" right={`$${grandTotal}`} rightAlign="right"/>

            <TouchableOpacity onPress={()=>{
                    const orderToAdd = {
                        amountPaid: `${grandTotal}`,
                        customerEmail: auth.currentUser.email,
                        customerName: auth.currentUser.displayName,
                        dateTime: dateStamp,
                        mealPackage: route.params.mealKit,
                        orderCode: sku,
                        subscriptionType: 1
                    }
                    db.collection('orders').add(orderToAdd)
                    .then(()=>{
                        console.log("New order added to database");
                        navigation.navigate('OrderSummary', {mealKit: route.params.mealKit, sku: sku, date: dateStamp, total: grandTotal});
                    });
                    
                }
            }>
            <Text style={styles.buttonStyle}>Proceed</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

function ListItem(props) {
    return (
        <View style={{flexDirection: "row", marginTop:5, marginHorizontal: 15, justifyContent: "space-between"}}>
            <Text style={styles.listLeft}>{props.left}</Text>
            <Text style={{fontSize: 15, textAlign: props.rightAlign}}>{props.right}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#ffd0a1',
      paddingHorizontal: 15,
    },
    header: {
        marginHorizontal: 15,
        fontSize: 17,
        fontWeight: "bold"
    },
    listLeft: {
        fontSize: 15, textAlign: "left", fontWeight:"bold"
    },
    onePickerItem: {
        height: 40,
    },
    buttonStyle: {
        backgroundColor: "lightgray", 
        paddingVertical: 8, 
        fontSize: 18, 
        borderWidth: 1, 
        borderRadius: 5, 
        width: "40%", 
        textAlign: "center", 
        marginTop: 15,
        marginRight: 15,
        alignSelf:"flex-end"
    }
});