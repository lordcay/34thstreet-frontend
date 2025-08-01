// import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
// import React, { useContext, useEffect, useState } from 'react';
// import AntDesign from 'react-native-vector-icons/AntDesign';
// import { useNavigation, useRoute } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import LottieView from 'lottie-react-native';
// import axios from 'axios';
// import jwtDecode from 'jwt-decode'; // Import this!
// import { AuthContext } from '../context/AuthContext';
// import { getRegistrationProgress } from '../registrationUtils';
// import { TouchableOpacity } from 'react-native';

// const PreFinalScreen = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { token, setToken } = useContext(AuthContext);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const loadToken = async () => {
//       const storedToken = await AsyncStorage.getItem('token');
//       console.log('Loaded token from AsyncStorage:', storedToken);
//       setToken(storedToken);
//     };

//     loadToken();
//   }, []);


//   useEffect(() => {
//     getAllUserData();
//   }, []);

//   useEffect(() => {
//     if (token) {
//       navigation.replace('MainStack', { screen: 'Main' });
//     }
//   }, [token, navigation]);



//   const getAllUserData = async () => {
//     try {
//       const screens = ['Name', 'Email', 'Password', 'Gender', 'Birth', 'Type'];
//       let userData = {};

//       for (const screen of screens) {
//         const data = await getRegistrationProgress(screen);
//         if (data) {
//           userData = { ...userData, ...data };
//         }
//       }

//       // ✅ Convert birth date format before sending
//       if (userData.birth) {
//         const [day, month, year] = userData.birth.split('/');
//         userData.birth = `${year}-${month}-${day}`; // Convert to YYYY-MM-DD
//       }

//       setUserData(userData);
//     } catch (error) {
//       console.error('Error retrieving user data:', error);
//     }
//   };

//   const clearAllScreenData = async () => {
//     try {
//       const screens = ['Name', 'Email', 'Password', 'Gender', 'Birth', 'Type'];
//       const keys = screens.map(screen => `registration_progress_${screen}`);
//       await AsyncStorage.multiRemove(keys);
//       console.log('All screen data cleared successfully');
//     } catch (error) {
//       console.error('Error clearing screen data:', error);
//     }
//   };




//   // const registerUser = async () => {
//   //   setLoading(true); // Start loader
//   //   try {
//   //       if (!userData?.email) {
//   //           console.error("Email is missing!");
//   //           setLoading(false);

//   //           return;
//   //       }

//   //       console.log('Attempting to register user with data:', userData);

//   //       const response = await axios.post('https://three4th-street-backend.onrender.com/accounts/register', userData);
//   //       console.log('Register response:', response.data);

//   //       const { token, userId } = response.data;

//   //       if (!userId) {
//   //           console.error("User ID is missing from the response!");
//   //           setLoading(false);

//   //           return;
//   //       }

//   //       //  Do NOT store token yet
//   //       console.log("Navigating to VerifyOTP with:", userId, userData.email);

//   //       //  Navigate to OTP verification screen
//   //       navigation.navigate('VerifyOTPScreen', { userId, email: userData.email });

//   //       // Clear temporary registration data
//   //       clearAllScreenData();
//   //   } catch (error) {
//   //       console.error('Error registering user:', error?.response?.data || error.message);
//   //   }  finally {
//   //     setLoading(false); // Stop loader
//   //   }
//   // };

//   const registerUser = async () => {
//     setLoading(true); // Start loader

//     try {
//       if (!userData?.email) {
//         console.error("Email is missing!");
//         setLoading(false);
//         return;
//       }

//       // ✅ Log and validate required fields
//       console.log("🧾 Final userData before register POST:", JSON.stringify(userData, null, 2));

//       const requiredFields = ['email', 'password', 'firstName', 'lastName', 'gender', 'type'];
//       for (const field of requiredFields) {
//         if (!userData[field]) {
//           console.error(`❌ Missing required field: ${field}`);
//           Alert.alert('Error', `Missing required field: ${field}`);
//           setLoading(false);
//           return;
//         }
//       }

//       // ✅ Clean payload (optional but recommended)
//       const payload = {
//         email: userData.email,
//         password: userData.password,
//         firstName: userData.firstName,
//         lastName: userData.lastName,
//         gender: userData.gender,
//         type: userData.type,
//         origin: userData.origin || '',
//         bio: userData.bio || '',
//         interests: userData.interests || [],
//       };

//       const response = await axios.post('https://three4th-street-backend.onrender.com/accounts/register', payload);
//       console.log('Register response:', response.data);

//       const { token, userId } = response.data;

//       if (!userId) {
//         console.error("User ID is missing from the response!");
//         setLoading(false);
//         return;
//       }

//       console.log("Navigating to VerifyOTP with:", userId, userData.email);
//       navigation.navigate('VerifyOTPScreen', { userId, email: userData.email });
//       clearAllScreenData();
//     } catch (error) {
//       console.error('Error registering user:', error?.response?.data || error.message);
//     } finally {
//       setLoading(false); // Stop loader
//     }
//   };


//   useEffect(() => {
//     const verifyUser = async () => {
//       if (!token) {
//         console.log("Token is missing, waiting for token...");
//         return;
//       }

//       try {
//         const decodedToken = jwtDecode(token);
//         if (!decodedToken?.userId) {
//           console.error("Invalid token, redirecting to Login");
//           await AsyncStorage.removeItem('token');
//           setToken(null);
//           navigation.navigate('Login');
//           return;
//         }

//         // ✅ Check if the user is verified before auto-login
//         const userId = decodedToken.userId;
//         console.log('Decoded Token User ID:', userId);

//         const response = await axios.get(`https://three4th-street-backend.onrender.com/users/${userId}`);

//         if (!response.data.user || !response.data.user.isVerified) {
//           console.log('User not verified. Redirecting to VerifyOTP.');
//           navigation.navigate('VerifyOTPScreen', { userId, email: response.data.user.email });
//           return;
//         }

//         console.log('User verified, navigating to MainStack');
//         navigation.navigate('MainStack', { screen: 'Main' });

//       } catch (error) {
//         console.error('User verification failed:', error?.response?.data || error.message);
//         await AsyncStorage.removeItem('token');
//         setToken(null);
//         navigation.navigate('Register');
//       }
//     };

//     if (token) {
//       verifyUser();
//     }
//   }, [token, navigation]);


//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <LottieView
//           source={require('../assets/loader.json')}
//           autoPlay
//           loop
//           style={{ width: 200, height: 200 }}
//         />
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>All set to register</Text>
//         <Text style={styles.subtitle}>Setting up your profile...</Text>
//       </View>

//       <LottieView
//         source={require('../assets/set.json')}
//         autoPlay
//         loop
//         style={styles.animation}
//       />

//       <TouchableOpacity style={styles.nextButton}
//         onPress={registerUser}
//       >
//         <Text style={styles.nextButtonText}>Let's step in</Text>
//       </TouchableOpacity>
//     </SafeAreaView>
//   );
// };

// export default PreFinalScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: 'white' },
//   header: { marginTop: 80, marginLeft: 20 },
//   title: { fontSize: 35, fontWeight: 'bold', fontFamily: 'GeezaPro-Bold' },
//   subtitle: { fontSize: 33, fontWeight: 'bold', fontFamily: 'GeezaPro-Bold', marginTop: 10 },
//   animation: { height: 260, width: 300, alignSelf: 'center', marginTop: 40 },
//   button: { backgroundColor: '#900C3F', padding: 15, marginTop: 'auto' },
//   buttonText: { textAlign: 'center', color: 'white', fontWeight: '600', fontSize: 15 },
//   loaderContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     zIndex: 999,
//   },
//   nextButton: {
//     backgroundColor: '#581845',
//     paddingVertical: 14,
//     borderRadius: 8,
//     marginTop: 120,
//     marginRight: 30,
//     marginLeft: 30,
//   },
//   nextButtonText: {
//     textAlign: 'center',
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },

// });


import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { AuthContext } from '../context/AuthContext';
import { getRegistrationProgress } from '../registrationUtils';

const PreFinalScreen = () => {
  const navigation = useNavigation();
  const { token, setToken } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      setToken(storedToken);
    };
    loadToken();
    getAllUserData();
  }, []);

  const getAllUserData = async () => {
    const screens = ['Name', 'Email', 'Password', 'Gender', 'Birth', 'Type'];
    let data = {};
    for (const screen of screens) {
      const part = await getRegistrationProgress(screen);
      if (part) data = { ...data, ...part };
    }
    if (data.birth) {
      const [d, m, y] = data.birth.split('/');
      data.birth = `${y}-${m}-${d}`;
    }
    setUserData(data);
  };

  const clearAllScreenData = async () => {
    const keys = ['Name', 'Email', 'Password', 'Gender', 'Birth', 'Type'].map(
      key => `registration_progress_${key}`
    );
    await AsyncStorage.multiRemove(keys);
  };

  const registerUser = async () => {
    setLoading(true);
    try {
      if (!userData?.email) return;
      const payload = {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        gender: userData.gender,
        type: userData.type,
        origin: userData.origin || '',
        bio: userData.bio || '',
        interests: userData.interests || [],
      };
      const res = await axios.post('https://three4th-street-backend.onrender.com/accounts/register', payload);
      const { userId } = res.data;
      navigation.navigate('VerifyOTPScreen', { userId, email: userData.email });
      clearAllScreenData();
    } catch (err) {
      console.error('Registration error:', err?.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <LottieView
          source={require('../assets/globe.json')}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <LottieView
          source={require('../assets/globe.json')}
          autoPlay
          loop={false}
          style={styles.animation}
        />
        <Text style={styles.header}>You're All Set!</Text>
        <Text style={styles.subtext}>
          Getting your profile set to meet your verified villager people.
        </Text>
        {/* <Text style={styles.subtext}>
          We’ve saved your info. Tap below to complete your signup and join your village.
        </Text> */}

        <TouchableOpacity style={styles.btn} onPress={registerUser}>
          <Text style={styles.btnText}>Join 34th Street</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PreFinalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F6FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  animation: {
    height: 130,
    marginBottom: 25,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
  },
  subtext: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  btn: {
    marginTop: 30,
    backgroundColor: '#581845',
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  loader: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
