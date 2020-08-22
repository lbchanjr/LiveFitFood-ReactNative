import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, FlatList, Platform, TextInput, View, Text, Image} from 'react-native';
import {auth, db, storage} from './firebaseConfig'
import { TouchableOpacity } from 'react-native-gesture-handler';

console.disableYellowBox = true;

export default function MainScreen({navigation, route}) {

    const [mealkits, setMealkits] = useState([]);
    const [kitPhotoUrl, setKitPhotoUrl] = useState([]);

    console.log("logged in!")
    console.log(`Name: ${route.params.name} Email: ${route.params.email}`)
    console.log(auth.currentUser)

    useEffect(() => {
        console.log("Retrieving mealkits from firebase...")
        db.collection('mealpackages')
        .get()
        .then(querySnapshot => {
            console.log('Total mealpackages: ', querySnapshot.size);
            const mealkitArray = [];
            querySnapshot.forEach(documentSnapshot => {
                const docData = documentSnapshot.data();
                const mealkitInfo = {name: docData.name, description: docData.description, imageName: docData.imageName, id: documentSnapshot.id, price: docData.price, avgCal: docData.avgCal}
                mealkitArray.push(mealkitInfo);    
            });
            setMealkits(mealkitArray);
        }) 
        .catch(error=> {
            console.log("Error in retrieving firestore data")
            console.error(error)
        });    
    }, []);

    // const getImageUrl = (imageName) => {
    //     return await storage.ref(`mealkits/${mealkits[i].imageName}`).getDownloadURL();
    // }

    useEffect(()=> {
        console.log('Mealkits have been updated')
        console.log(mealkits)

        console.log('Retriving photo urls of mealkits')
        setKitPhotoUrl([])
        for (let i=0; i < mealkits.length; i++) {
            storage.ref(`mealkits/${mealkits[i].imageName}`).getDownloadURL()
            .then((url) => {
                setKitPhotoUrl(oldArray=>[...oldArray, url])
            })
//            setKitPhotoUrl(oldArray=>[...oldArray, getImageUrl()])
        }
        
    }, [mealkits])

    useEffect(()=> {
       console.log("Number of kit photo urls: " + kitPhotoUrl.length);
       kitPhotoUrl.forEach(url=>console.log(url))
    }, [kitPhotoUrl])

    const renderItem = ({item}) => {

        const filterkit = mealkits.filter((kit)=>item.includes(kit.imageName))
        console.log(`Image url: ${item}`)
        return (
            <TouchableOpacity style={styles.mealkit} key={filterkit[0].id}  onPress={()=>{
                console.log(filterkit[0].name + " was clicked.");
                navigation.navigate("MealScreen", {kitID: filterkit[0].id, kitName: filterkit[0].name, price: filterkit[0].price, desc: filterkit[0].description})
                
            }}>
                <Image style={{width: 100, height: 100, margin: 5}} source={{uri: item}}/>
                <View style={{flexDirection:'column', flexWrap:'wrap' ,marginVertical: 5, marginLeft: 10}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>{filterkit[0].name}</Text>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', width: Platform.OS==='web'?'100%':'85%'}}>
                        <Text style={{marginTop: 3, fontSize: 13}}>{filterkit[0].description}</Text>
                    </View> 
                    <Text style={{fontSize: 13}}>Avg. calories / meal: {filterkit[0].avgCal}</Text>
                    <Text style={{fontSize: 13}}>Price: ${filterkit[0].price} (7-day subscription)</Text>
                </View>
            </TouchableOpacity>   
        );
    }

    const signOutPressed = () => {
        auth.signOut()
        .then(()=>{
            console.log("user signed out.")
            console.log(auth.currentUser);
            navigation.reset({
                index: 0,
                routes: [{ name: 'UserLogin' }],
            })
        })
        .catch((error)=> {
            console.error(error);
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{marginTop: 15, fontSize: 25, fontWeight: "bold"}}>Hello, {auth.currentUser.displayName}.</Text>
            <Text style={{marginTop: 5, marginBottom: 5, fontSize: 20, fontWeight: "bold"}}>Please select a meal package</Text>
            <TouchableOpacity onPress={signOutPressed}>
                <Text style={{borderWidth: 1, borderRadius: 3, marginBottom: 5, paddingHorizontal: 25, paddingVertical:3, backgroundColor:'lightgray'}}>Sign-out</Text>
            </TouchableOpacity>
            <FlatList style={{width:"100%"}}
                data = {kitPhotoUrl}
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
    },
    mealkit: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: "#ffe8d1",
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 2,
        marginHorizontal: 3,
    }
});