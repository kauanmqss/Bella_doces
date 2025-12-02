import React, { useState, useContext, useEffect } from 'react';
import { View, Text, FlatList, Image, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import styles from './styles';
import { ItemContext } from './ItemContext';

// Tema reutilizável para inputs
const inputTheme = {
  fonts: { regular: { fontFamily: 'Montserrat-Regular' } },
  roundness: 30,
  colors: {
    primary: '#d6337f', // borda rosa ao focar
    text: '#000',
    placeholder: '#999',
  },
};

const URL_FIREBASEPRODUTOS = 'https://firestore.googleapis.com/v1/projects/produtos-9f36d/databases/(default)/documents/produtos';

 
// ---------- TELA DE CADASTRO ---------- 
export function AdminScreen() {
  const { itens, setItens, carregarProdutos } = useContext(ItemContext);
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState(''); // Variáveis de estado!
  const [imagem, setImagem] = useState('');
  const [mensagem, setMensagem] = useState('');
  

  const cadastrarItem = async () => {
    if (!nome.trim() || !preco.trim() || !imagem.trim()) { //Função cadastrar item. Retorna erro caso os campos não estejam preenchidos!
      setMensagem('Preencha todos os campos!');
      return;
    }

    setMensagem('Cadastrando produto...');

    try {
      const response = await fetch(URL_FIREBASEPRODUTOS, {
        //Method POST para enviar os dados para o FireBase
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            //Define os campos nome, preço e imagem.
            nome: { stringValue: nome },
            preco: { doubleValue: parseFloat(preco) }, 
            imagem: { stringValue: imagem },
          },
        }),
      });

      const data = await response.json(); //Converte a resposta em JSON

      //Se a resposta for ok.
      if(response.ok){ 
        setMensagem('Produto cadastrado com sucesso!');
        setNome('');
        setPreco(''); //Limpa os campos para inserir mais um produto.
        setImagem('');
        console.log('Produto salvo no firestore!', data);

        await carregarProdutos(); //Recarrega a lista de produtos.

      } else {
        console.error('Erro firestore', data); //Mostra no console uma mensagem de erro
        setMensagem('Preencha os campos corretamente!'); //Mostra uma mensagem de erro na tela!
      }

    } catch (error) {
      console.error('Erro de conexão', error); //Mostra no console uma mensagem de erro
      setMensagem('Erro de conexão com o banco!'); //Mostra uma mensagem de erro de conexão com o FireBase na tela!
    }
  };

//A FUNÇÃO ESTAVA AQUI

  return (
    <View style={styles.adminContainer}> {/* Container da página do admin */}
      <Text style={styles.titulo}>Cadastrar Novo Item</Text>

    {/* Input nome do item da página de cadastro de itens*/}
      <TextInput
        placeholder="Nome do item"
        style={styles.inputs}
        theme={inputTheme}
        mode="outlined"
        value={nome}
        onChangeText={setNome}
        outlineColor='transparent'
        
      />

      {/* Input preço da página de cadastro de itens*/}
      <TextInput
        placeholder="Preço (R$)"
        style={styles.inputs}
        theme={inputTheme}
        mode="outlined"
        keyboardType="numeric"
        value={preco}
        onChangeText={setPreco}
        outlineColor='transparent'
        
      />

      {/* Input do URL da imagem da página de cadastro de itens*/}
      <TextInput
        placeholder="URL da imagem"
        style={styles.inputs}
        theme={inputTheme}
        mode="outlined"
        value={imagem}
        onChangeText={setImagem}
        outlineColor='transparent'
        activeOutlineColor='#6200ee'
      />

      {/* Verifica de existe uma mensagem de erro */}
      {mensagem ?  (
        //Se existir retorna uma mensagem!
        <Text 
          style={{
            marginTop: 10,
            fontSize: 16,
            color: mensagem.includes('sucesso') ? 'green': 'red', //Verdade caso seja sucesso, caso contrário, vermelho.
          }}
        >
         {mensagem}
        </Text>
      ) : null} {/* Retorna nada caso não exista mensagem de erro*/}


      {/* Botão adicionar item */}
      <Button mode="contained" 
          labelStyle={{ fontFamily: 'Montserrat-Bold' }}
          color="#D6337F" 
          onPress={cadastrarItem} 
          style={styles.botoes}>
        Adicionar Item
      </Button>

    </View>
  );
}

// ---------- TELA DE RELATÓRIO ----------
function RelatorioScreen() {
  const { itens, setItens, carregarProdutos, editarItens, excluirDoBancoDeDados } = useContext(ItemContext);
  const [modalVisivel, setModalVisivel] = useState(false); {/* Variáveis de estado e fun~ções do ItemContext */}
  const [itemSelecionado, setItemSelecionado] = useState(null);

  useEffect(() => {
    carregarProdutos(); {/* Carrega a lista de produtos */}
    }, []);

  const totalItens = itens.length; {/* Conta quantos itens existem na array 'itens'. */}
  const totalPreco = itens.reduce((acc, item) => acc + parseFloat(item.preco || 0), 0);  {/* Soma o preço dos produtos, e começa com o contador inicial como 0 */}


   const excluirItem = (id) => {
    Alert.alert(
      'Excluir Item',
      'Tem certeza que deseja excluir esse item ?',
      [
        { text: 'cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            await excluirBancoDeDados(id);
          },
          style: 'destructive',
        },
      ]
    );
  };

 {/* Abre o modal de edição com o item que será modificado */}
  const abrirModal = (item) => {
    setItemSelecionado(item); {/* Armazena o item editado */}
    setModalVisivel(true); {/* Seta o modal como true, fazendo ele aparecer */}
  };

{/* Fecha o modal de edição */}
  const fecharModal = (item) => {
    setModalVisivel(false); {/* Seta o modal como false, fazendo ele desaparecer */}
    setItemSelecionado(null); {/* O item retorna nada */}
  };

{/* Função salvar edição */}
  const salvarEdicao = async () => {
    if (!itemSelecionado?.nome || !itemSelecionado?.preco || !itemSelecionado?.imagem) return; {/* Retorna caso os campos não sejam preenchidos */}

  {/* Chama a função editar itens vinda do ItemContext, junto com o ID */}
    await editarItens(itemSelecionado.id, {
      nome: itemSelecionado.nome,
      preco: parseFloat(itemSelecionado.preco), // Garante que o valor seja número flutuante */}
      imagem: itemSelecionado.imagem,
    });

    await carregarProdutos(); {/* Atualiza a lista de itens e fecha o modal */}
    fecharModal();
  };

  return (
    <View style={styles.adminContainer}> {/* Container da tela de relatório */}
      <Text style={styles.titulo}>Relatório de Itens</Text> {/* Titulo da tela de relatório */}

      {/* Texto que mostra a quantidade de itens armazenados */}
      <Text style={{ marginTop: 10, fontSize: 18, fontFamily: 'Montserrat-Regular' }}>
        Total de itens: {totalItens}
      </Text>

      {/* Mostra a soma de todos os produtos como float */}
      <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Regular' }}>
        Soma de preços: R$ {totalPreco.toFixed(2).replace('.', ',')}
      </Text>


      {/* Se o tamanho da lista de itens for 0, mostra que nenhum item está cadastrado! */}
      {itens.length === 0 ? (
        <Text style={{ marginTop: 20, fontSize: 18, fontFamily: 'Poppins-Regular' }}>Nenhum item cadastrado.</Text>
      ) : (
        <FlatList
          data={itens} //Mostra os itens armazenados na lista
          keyExtractor={(item) => item.id} //Define uma chave unica para cada item
          contentContainerStyle={{ marginTop: 20, alignItems: 'center', }} //Um estilo rápido para o container
          renderItem={({ item }) => (
            <View
              style={{
                backgroundColor: '#FFE6F0',
                borderRadius: 10,
                padding: 10,                  //Estilos da lista
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
                    resizeMode: 'cover',     //Estilos da imagem
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
    
                 }}
              />
              
              {/* Texto que mostra o nome do item*/}
              <Text style={{ fontWeight: 'bold', fontSize: 18, fontFamily: 'Montserrat-Regular' }}>{item.nome}</Text> 
              <Text>R$ {parseFloat(item.preco). toFixed(2).replace(',', '.')}</Text> {/* Mostra o preço dele com ponto flutuante */}

              {/* Botão excluir*/}
              <Button
                labelStyle={{ fontFamily: 'Montserrat-Bold' }}
                color="#d6337f"
                mode='contained'
                onPress={() => excluirDoBancoDeDados(item.id)} //Quando clicado excluir o item da lista e do banco de dados
                style={styles.botoes}
              >
                Excluir
            </Button>
            
            {/* Botão editar */}
             <Button
                labelStyle={{ fontFamily: 'Montserrat-Bold' }}
                color="#d6337f"
                mode="contained"
                onPress={() => abrirModal(item)} //Abre o modal de edição quando clicado.
                style={styles.botoes}
              >
                Editar
              </Button>
            </View>
          )}
        />
      )}

      {/* Como o modal vai ser exibido*/}
      {modalVisivel && (
        <View style={styles.overlay}>
          <View style={styles.modalContainer}> {/* Container do modal */}
            <Text style={styles.modalTitulo}>Editar produto</Text> {/* Título do modal */}

            {/* Input nome do modal */}
            <TextInput
              label="Nome"
              value={itemSelecionado?.nome || ''}
              onChangeText={(txt) => setItemSelecionado({ ...itemSelecionado, nome: txt })}
              mode="outlined"
              style={styles.inputs}
              theme={inputTheme}
            />

            {/* Input preço do modal */}
            <TextInput
              label="Preço"
              value={String(itemSelecionado?.preco || '')}
              onChangeText={(txt) => setItemSelecionado({ ...itemSelecionado, preco: txt })}
              mode="outlined"
              style={styles.inputs}
              keyboardType="numeric"
              theme={inputTheme}
            />

            {/* Input da URL da imgem do modal */}
            <TextInput
              label="URL da imagem"
              value={itemSelecionado?.imagem || ''}
              onChangeText={(txt) => setItemSelecionado({ ...itemSelecionado, imagem: txt })}
              mode="outlined"
              style={styles.inputs}
              theme={inputTheme}
            />

            {/* Veifica se o item selecionado possui uma imagem */}
            {itemSelecionado?.imagem ? (
              <Image source={{ uri: itemSelecionado.imagem }} style={styles.imagemPreview} />
            ) : null}

            {/*  Botão de salvar edição do modal */}
            <Button
              mode="contained"
              color="#d6337f"
              labelStyle={{ fontFamily: 'Montserrat-Bold', fontSize: 16 }}
              onPress={salvarEdicao}
              style={[styles.botoes, { marginTop: 10 }]}
            >
              Salvar alterações
            </Button>

            {/*  Botão de cancelar edição do modal */}
            <Button
              mode="contained"
              color="#a62e5c"
              labelStyle={{ fontFamily: 'Montserrat-Bold', fontSize: 16 }}
              onPress={fecharModal}
              style={[styles.botoes, { marginTop: 10 }]}
            >
              Cancelar
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

// ---------- TELA DE VENDAS  ----------
function VendasScreen() {
  const { itens, atualizarStatus, atualizarQuantidade, carregarProdutos } = useContext(ItemContext);

  useEffect(()=> {
    carregarProdutos(); {/* Recarrega a lista de produtos */}
  }, [])

  {/*  Caso o tamanho da lista de itens for 0, mostra nenhum produto cadastrado*/}
  if (itens.length === 0) {
    return (
      <View style={styles.container}> {/* Container da pagina de vendas */}
        <Text style={styles.titulo}>Vendas</Text> {/*  Titulo da loja de vendas */}
        <Text style={{ marginTop: 20, fontSize: 18, fontFamily: 'Poppins-Regular' }}>Nenhum produto cadastrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.adminContainer}> {/*  Container da pagina de vendas */}
      <Text style={styles.titulo}>Status dos produtos</Text> {/* Titulo da pagina caso tiver um item na lista */}

      <FlatList
        data={itens} //Mostra os dados da lista de itens
        keyExtractor={(item) => item.id} //Cria uma chave para cada item
        contentContainerStyle={{marginTop: 20}} //Estilo rápido da lista
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: '#FFF3F8',
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,   //Estilos da página de vendas
              width: 280,
              alignItems: 'center',
            }}
          >
            <Image
              source={{ uri: item.imagem }}
              style={{ 
                    width: 220,
                    height: 160,
                    borderRadius: 15,
                    marginBottom: 8,
                    resizeMode: 'cover',  //Estilos da imagem da página de vendas
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
               }}
            />
            <Text style={{ fontWeight: 'bold', fontSize: 18}}>{item.nome}</Text> {/* Nome do item da lista */}
            <Text>Preço: R$ {item.preco}</Text> {/* Preco do item da lista */}
            <Text>Quantidade vendida: {item.quantidade}</Text> {/* Quantidade vendida do item da lista */}
            <Text>Status: {item.status}</Text> {/* Status do item da lista */}

            <View style={{ flexDirection: 'row', marginTop: 8}}>

              {/* Botão que adiciona uma unidade ao numero de vendas do item */}
              <Button
                mode='contained'
                labelStyle={{ fontFamily: 'Montserrat-Bold' }}
                color="#d6337f"
                onPress={() => atualizarQuantidade(item.id, (Number(item.quantidade) || 0)+ 1)}
                style={{ marginHorizontal: 5 }}
              >
               + Venda
              </Button>


              {/* Botão que altera os status do item, definindo como 'Disponível' || 'Esgotado' */}
              <Button
                mode='outlined'
                labelStyle={{ fontFamily: 'Montserrat-Bold' }}
                color="#d6337f"
                onPress={() => atualizarStatus(item.id, item.status === 'Disponível' ? 'Esgotado' : 'Disponível')}> {/* Quando clicado atualiza os status do item */}
                {item.status === 'Disponível' ? 'Esgotado' : 'Disponibilizar'}
              </Button>
            </View>
          </View>
        )}
      />
    </View>
  );
}




// ---------- DRAWER ----------
const Drawer = createDrawerNavigator();

export default function LojaScreen() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#331D26' },
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#FADEEA', width: 220 },
          headerTitleStyle: {
          fontFamily: 'Montserrat-Regular',
          fontWeight: 400,
          fontSize: 18,
          color: '#fff'},
        drawerActiveTintColor: '#D6337F',
        drawerLabelStyle: 
          { fontSize: 16, fontFamily: 'Montserrat-Regular' },
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
          <DrawerItemList {...props} />
          <View style={{ flex: 1 }} />
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
      <Drawer.Screen name="Tela Admin" component={AdminScreen} />
      <Drawer.Screen name="Relatórios" component={RelatorioScreen} />
      <Drawer.Screen name="Vendas" component={VendasScreen} />
    </Drawer.Navigator>
  );
}
