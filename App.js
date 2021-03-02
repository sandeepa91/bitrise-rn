

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Amplify ,{ Auth} from 'aws-amplify';
import config from './src/aws-exports'
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import ConfirmSignUp from './src/screens/ConfirmSignUp';
import Home from './src/screens/Home';
Amplify.configure(config);

import {withAuthenticator} from 'aws-amplify-react-native';

const AuthenticationStack = createStackNavigator();
const AppStack = createStackNavigator();
const AuthenticationNavigator = props => {
  return (
    <AuthenticationStack.Navigator headerMode="none">
      <AuthenticationStack.Screen name="SignIn">
        {screenProps => (
          <SignIn {...screenProps} updateAuthState={props.updateAuthState} />
        )}
      </AuthenticationStack.Screen>
      <AuthenticationStack.Screen name="SignUp" component={SignUp} />
      <AuthenticationStack.Screen
        name="ConfirmSignUp"
        component={ConfirmSignUp}
      />
    </AuthenticationStack.Navigator>
  );
};

const AppNavigator = props => {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Home">
        {screenProps => (
          <Home {...screenProps} updateAuthState={props.updateAuthState} />
        )}
      </AppStack.Screen>
    </AppStack.Navigator>
  );
};


const Initializing = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  };

function App() {
  const [isUserLoggedIn, setUserLoggedIn] = useState('initializing');

  useEffect(() => {
        checkAuthState();
      }, []);
      async function checkAuthState() {
        try {
          await Auth.currentAuthenticatedUser();
          console.log(' User is signed in');
          setUserLoggedIn('loggedIn');
        } catch (err) {
          console.log(' User is not signed in');
          setUserLoggedIn('loggedOut');
        }
      }
      function updateAuthState(isUserLoggedIn) {
        setUserLoggedIn(isUserLoggedIn);
      }

      return (
              <NavigationContainer>
                {isUserLoggedIn === 'initializing' && <Initializing />}
                {isUserLoggedIn === 'loggedIn' && (
                  <AppNavigator updateAuthState={updateAuthState} />
                )}
                {isUserLoggedIn === 'loggedOut' && (
                  <AuthenticationNavigator updateAuthState={updateAuthState} />
                )}
              </NavigationContainer>
            );

    // async function signOut() {
    //   try {
    //     await Auth.signOut();
    //   } catch (error) {
    //     console.log('Error signing out: ', error);
    //   }
    // }
    // return (
    //   <View style={styles.container}>
    //     <Text> +  = React Native + Amplify </Text>
    //     <Button title="Sign Out" color="tomato" onPress={signOut} />
    //     <StatusBar style="auto" />
    //   </View>
    // );
  }

const styles = StyleSheet.create({
  container: {
    marginTop: 250,
    alignItems: 'center',
    flex: 1
  },
});

// export default withAuthenticator(App);
export default App;

