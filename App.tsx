import './global.css';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '~/screens/LoginScreen';
import RegisterScreen from '~/screens/RegisterScreen';
import { useEffect } from 'react';
import { migrate } from 'lib/db';
import ContactListScreen from '~/screens/ContactListScreen';
import DashboardScreen from '~/screens/DashboardScreen';
import AddTransactionScreen from '~/screens/AddTransactionScreen';

const Stack = createNativeStackNavigator();

export default function App() {

  useEffect(()=>{
    migrate()
  },[])

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Login'
          screenOptions={{
            headerShown: false
          }}
        >
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='Register' component={RegisterScreen} />
          <Stack.Screen name='ContactList' component={ContactListScreen} />
          <Stack.Screen name='Dashboard' component={DashboardScreen} />
          <Stack.Screen name='AddTransaction' component={AddTransactionScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </>
  );
}
