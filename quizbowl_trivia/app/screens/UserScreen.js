import React, { Fragment,useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, Dimensions, View, ScrollView, Pressable, Alert} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

function UserScreen(props) {
    const [allUsers, setAllUsers] = useState(null);
    const currentUsername = useSelector(state => state.user.name);
    const userToken = useSelector(state => state.user.userToken);

    useEffect(() => {
      const getAllUsers = async () => {
        await fetch("https://quizbowl.shoryamalani.com/get_all_users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(response => response.json())
        .then(result => {
            console.log(result);
            console.log(result.length)
            setAllUsers(result);
        }).catch(error => {
          console.log(error);
        })
      }
      getAllUsers()
    }, [])
    
    return (
        <Fragment>
        <View style={styles.infoScreenTextContainer}>
            <StatusBar style="dark"/>
            <LinearGradient
                colors={['#E38C58', '#4EBCB7']}
                style={{width: width, height: height}}    
            >
            
            <SafeAreaView>
            <ScrollView>          
            <View style={styles.textBox}>
                <Text style={styles.infoScreenText}>Username + click on all the other people using the app and being able to play on it</Text>
            </View>
            { allUsers != null && (
                allUsers.map((user, index) => {
                    if (user[4] != userToken) { 
                return (
                <View style={styles.textBox} key={index}>
                    <Text style={styles.infoScreenText}>{user[1] == null ? user[4] : user[1]}</Text>
                </View>
            )}}))

            }
            </ScrollView>
            </SafeAreaView>
            </LinearGradient>
        </View>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    infoScreenText: {
        padding: 30,
        fontSize: 18,
        color: '#281e8d'
    },
    infoScreenNote: {
        padding: 30,
        fontSize: 19,
        color: 'black'
    },
    infoScreenTextContainer: {
        flex: 1,
    },
    textBox: {
        width: width / 1.1,
        backgroundColor: '#03ffa9',
        borderRadius: 30,
        top: 10,
        marginBottom: 10,
        resizeMode: 'contain',
        marginLeft: 15,
        // alignItems: 'center',
    },
})

export default UserScreen;