import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, FlatList, Platform, TextInput, View, Text, Image} from 'react-native';
import {auth, db, storage} from './firebaseConfig'
import { TouchableOpacity } from 'react-native-gesture-handler';

console.disableYellowBox = true;

export default function MealScreen({navigation, route}) {

    const [meals, setMeals] = useState([]);
    const [mealPhotoUrl, setmealPhotoUrl] = useState([]);

    useEffect(() => {
        console.log("Retrieving meals from firebase...")
        db.collection('mealpackages').doc(route.params.kitID).collection('meals')
        .get()
        .then(querySnapshot => {
            console.log('Total meals found: ', querySnapshot.size);
            const mealArray = [];
            querySnapshot.forEach(documentSnapshot => {
                const docData = documentSnapshot.data();
                const mealInfo = {name: docData.name, description: docData.description, imageName: docData.imageName, calories: docData.calories, id: documentSnapshot.id}
                mealArray.push(mealInfo);    
            });
            setMeals(mealArray);
        }) 
        .catch(error=> {
            console.log("Error in retrieving firestore data")
            console.error(error)
        });    
    }, []);

    useEffect(()=> {
        console.log('Meal have been updated')
        console.log(meals)

        console.log('Retriving photo urls of meals')
        setmealPhotoUrl([])
        for (let i=0; i < meals.length; i++) {
            storage.ref(`meals/${meals[i].imageName}`).getDownloadURL()
            .then((url) => {
                setmealPhotoUrl(oldArray=>[...oldArray, url])
            })
        }
        
    }, [meals])

    useEffect(()=> {
       console.log("Number of meal photo urls: " + mealPhotoUrl.length);
       mealPhotoUrl.forEach(url=>console.log(url))
    }, [mealPhotoUrl])

    const renderItem = ({item}) => {

        const filterMeal = meals.filter((meal)=>item.includes(meal.imageName))
        console.log(`Image url: ${item}`)
        return (
            <View style={styles.meals} key={filterMeal[0].id}>
                <Image resizeMode="cover" style={{flexBasis: "20%", alignSelf: "center", width: 100, height: 100, margin: 5}} source={{uri: item}}/>
                <View style={{flexBasis: "80%", flexDirection:'column', flexWrap:'wrap' ,marginVertical: 5, marginLeft: 10}}>
                    <Text style={{fontSize: 20, fontWeight: 'bold', width: Platform.OS==='web'?'80%':'85%'}}>{filterMeal[0].name}</Text>
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', width: Platform.OS==='web'?'80%':'85%'}}>
                        <Text style={{marginTop: 3, fontSize: 13}}>{filterMeal[0].description}</Text>
                    </View> 
                    <Text style={{fontSize: 13, fontWeight:"bold", fontStyle:"italic"}}>Calories: {filterMeal[0].calories}</Text>
                </View>
            </View>   
        );
    }
    return (
        <SafeAreaView style={styles.container}>
            <Text style={{marginTop: 15, fontSize: 23, fontWeight: "bold"}}>{route.params.kitName} Meal Package</Text>
            <Text style={{marginTop: 10, fontSize: 12, textAlign: "center"}}>{route.params.desc}</Text>
            <Text style={{marginTop: 5, marginBottom: 5, color: "red", fontSize: 15, fontWeight: "bold"}}>Price: ${route.params.price.toFixed(2)}</Text>
            
            <TouchableOpacity onPress={()=>navigation.navigate('ConfirmPurchase', {mealKit: route.params.kitName, price: route.params.price})}>
                <Text style={{borderWidth: 1, borderRadius: 3, marginBottom: 5, paddingHorizontal: 20, paddingVertical:3, backgroundColor:'lightgray'}}>Buy Meal Kit</Text>
            </TouchableOpacity>
            <FlatList style={{width:"100%"}}
                data = {mealPhotoUrl}
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
    meals: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: "#ffe8d1",
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 2,
        marginHorizontal: 3,
    }
});