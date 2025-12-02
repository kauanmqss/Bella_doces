import { Text, View, Image, FlatList } from 'react-native';
import { useState, useContext } from 'react'
import { Button, TextInput } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AdminScreen from './admin';
import { ItemContext }  from './ItemContext'
import styles from './styles';



function LojaHome ({ navigation }) { {/* Função da tela da Loja */}

  const { itens } = useContext(ItemContext); {/* Função do ItemContext*/}
  return (
    <View style={styles.lojaContainer}> {/* Container da página da Loja  */}
      <Text style={styles.titulo}>Bem-vindo à loja!</Text> {/* Titulo da página da loja*/}
      
      {/* Caso o numero de itens for igual a 0, mostra nenhum produto disponível*/}
      {itens.length === 0  ? (
        <Text style={{marginTop: 20, fontSize: 18, fontWeight: 'bold', fontFamily: 'Poppins-Regular' }}> {/* Texto caso a lista de itens esteja vazia */}
          Nenhum produto disponível.
        </Text>
      ) : (
        <FlatList
          data={itens} //Mostra os itens armazenados na lista de itens
          keyExtractor={(item) => item.id} //Define uma chave para cada item
          contentContainerStyle={{marginTop: 20, alignItems: 'center' }} //Estilos rapidos da lista
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: '#FFF3F8',
                borderRadius: 10,
                padding: 10,    //Estilos da pagina da loja
                marginBottom: 10,
                alignItems: 'center',
                width: 250,
              }}
            >
              <Image
                source={{ uri: item.imagem }}
                style={{ 
                  width: 220,
                    height: 160,
                    borderRadius: 15,
                    marginBottom: 8,
                    resizeMode: 'cover',  //Estilos da imagem
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                 }}
              />
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.nome}</Text> {/* Nome do produto da lista */}
              <Text>R$ {item.preco}</Text> {/* Preço do produto da lista */}
              <Text>Status: {item.status}</Text> {/* Status do produto da lista */}
            </View>
          )}
        />
      )}
    </View>
  );
}



const Drawer = createDrawerNavigator();


export default function LojaScreen() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#331D26' },
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#FADEEA', width: 220 },
        drawerActiveTintColor: '#D6337F',
        drawerLabelStyle: { fontSize: 16 },
    }}

    drawerContent={(props) => (
      <DrawerContentScrollView {...props} contentContainerStyle={{ flex:1 }}>
        <DrawerItemList {...props} />

        <View style={{flex: 1 }} />

        <View style={{ padding: 16 }}>
          <Button
            mode='contained'
            style={styles.botaoMenu}
            labelStyle={{ fontFamily: 'Montserrat-Bold' }}
            color="#D6337F"
            onPress={() => props.navigation.navigate('Login')}
          >
          Sair
          </Button>
        </View>
      </DrawerContentScrollView>
    )}
  >
      
    <Drawer.Screen name="Loja" component={LojaHome} />
  </Drawer.Navigator> 
  );
}
