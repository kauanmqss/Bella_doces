import { Text, View } from 'react-native';
import { useEffect } from 'react'
import {  ActivityIndicator } from 'react-native-paper';
import styles from './styles';

export default function LoadingScreen ({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login'); 
    }, 2000);
    return () => clearTimeout(timer);
  }, []);


  return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color='#D6337F' />
      <Text style={styles.tituloLoading}>Carregando...</Text>
    </View>
  );
}