import React, { Fragment,useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, Dimensions, View, ScrollView, Pressable, Alert, Switch} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import { Button } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

function UserScreen(props) {
    const [allUsers, setAllUsers] = useState(null);
    const currentUsername = useSelector(state => state.user.name);
    const userToken = useSelector(state => state.user.userToken);
    const [userPublic, setUserPublic] = useState(null);
    const navigation = useNavigation();
    const sortUsersByPoints = (users) => {
        users.sort(function(a, b) {
            return b[8] - a[8];
        });
        return users;
    }
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
            result = sortUsersByPoints(result);
            setAllUsers(result);
            result.forEach((user) => {
                if (user[4] === userToken) {
                    setUserPublic(user[10]);
                }
            })
        }).catch(error => {
          console.log(error);
        })
      }
      getAllUsers()
    }, [])
    useEffect(() => {
        if (userPublic === null) {
            return;
        }
        const updateUserPublic = async () => {
            await fetch("https://quizbowl.shoryamalani.com/update_user_public", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "token": userToken,
                    "public": userPublic
                })
            })
            .then(response => response.json())
            .then(result => {
                console.log(result);
            }).catch(error => {
                console.log(error);
            })
        }
        updateUserPublic()
    }, [userPublic])
    
    return (
        <Fragment>
        <View style={styles.infoScreenTextContainer}>
            <StatusBar style="dark"/>
            <LinearGradient
                colors={['#57fde4', '#FD5770']}
                style={{width: width, height: height}}    
            >
            <View style={styles.scoreTextContainer}>
                <Text style={styles.scoreText}>
                    Profile
                </Text>
            </View>        
            {/* <SafeAreaView> */}
            <View style={{height: 50}} />
            <ScrollView>       
            <View style={styles.textBox}>
                <Text style={styles.infoScreenText}>Your Username: {currentUsername}</Text>
            </View>
            <View style={styles.textBox}>
                <Text style={styles.infoScreenText}>Do you want your statistics to be public to others playing the game? All usernames are randomly generated, so there's no risk of strangers knowing your personal stats!</Text>
                <Switch
                    style={{ height: 30, bottom: 27, alignSelf: 'center', right: 20 }}
                    thumbColor="#ff3bac"
                    trackColor={{ false: '#3b92ff', true: '#51009c' }}
                    ios_backgroundColor='#3b92ff'
                    value={userPublic == null ? false : userPublic}
                    onValueChange={(value) => setUserPublic(value)}
                />
            </View>
            </ScrollView>                
            <View style={[styles.scoreTextContainer, {top: 15}]}>
                <Text style={styles.scoreText}>
                    Other Users
                </Text>
            </View>
            <ScrollView style={{bottom:  5}}>            
            { allUsers != null && (
                allUsers.map((user, index) => {
                    if (user[4] != userToken) { 
                return (
                <Button type = "clear" style={styles.textBox} key={index} onPress={
                    () => {
                        navigation.navigate('Stats', {
                            token: user[4]
                        })
                    }
                }>
                    <Text style={styles.infoScreenText}>{user[1] == null ? user[4] : user[1]}{"\n"}XP: {user[8]}</Text>
                </Button>
            )}
            
        }))

            }       
            </ScrollView>
            {/* </SafeAreaView> */}
            </LinearGradient>
        </View>
        </Fragment>
    );
}

const styles = StyleSheet.create({
    infoScreenText: {
        padding: 30,
        fontSize: 18,
        color: '#14002a'
    },
    infoScreenNote: {
        padding: 30,
        fontSize: 19,
        color: 'black'
    },
    infoScreenTextContainer: {
        flex: 1,
    },
    scoreTextContainer: {
        width: width / 1.2,
        backgroundColor: '#c590ff',
        borderRadius: 30,
        top: 60,
        marginBottom: 10,
        resizeMode: 'contain',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20
    },
    scoreText: {
        fontSize: 35,
        color: '#001310',
        padding: 15,
    },
    textBox: {
        width: width / 1.1,
        backgroundColor: '#ffbc5e',
        borderRadius: 30,
        top: 10,
        marginBottom: 10,
        resizeMode: 'contain',
        marginLeft: 15,
        alignItems: 'flex-start',
    },
})

export default UserScreen;