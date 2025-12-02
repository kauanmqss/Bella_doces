import {StyleSheet} from 'react-native';

export default StyleSheet.create({

  container: {
    flex: 1,
    padding: 0,
    margin: 0,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#FAC8DC'
  },
   logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 80,
    borderRadius: '50%',
    borderWidth: 3,
    borderColor: '#FAC8DC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation:10,
  },
  
  titulo:{
    fontFamily: 'Montserrat-Regular',
    fontSize: 50,
    textAlign: 'center',
    top: -45,
    fontWeight: 'bold',
    color: '#D6337F',
    textShadowColor: '#aaa',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },

  inputs: {
    marginBottom: 15,
    width: '80%',
    borderRadius: 50,
    backgroundColor: '#FFE6F0',
  },

  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems:'center',
    gap: 10,
  },
  botoes: {
    marginVertical: 8,
    paddingVertical: 3,
    borderRadius: 20,
    flexDirection: 'row',
  },

  botaoMenu: {
    borderRadius: 20,
    marginVertical: 8,
  },
  
  frase: {
    marginTop: 13,
    fontSize: 16,
    fontStyle: 'italic',
    fontFamily: 'Poppins-Regular' ,
    marginVertical: 15,
    color: '#555'
  },

  erroText: {
    color: 'red',
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center'
  },

  adminContainer: {
  flex: 1,
  padding: 0,
  margin: 0,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#FACFF1',
  paddingTop: 80,
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 20,
    width: 320,
    alignItems: 'center',
    elevation: 10,
  },

  modalTitulo: {
    fontSize: 22,
    fontFamily: 'Montserrat-Bold',
    color: '#d6337f',
    marginBottom: 10,
  },

  imagemPreview: {
    width: 150,
    height: 120,
    borderRadius: 15,
    marginVertical: 10,
    resizeMode: 'cover',
  },

  lojaContainer: {
  flex: 1,
  padding: 0,
  margin: 0,
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#FACFF1',
  paddingTop: 80,
  },

  tituloLoading: {
    fontSize:31.5,
    color: '#D6337F',
    fontFamily: 'Poppins-Regular' ,
  },
  
})
