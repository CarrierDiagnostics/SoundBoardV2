import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  text: {
    textDecorationColor:"white",
    margin:30,
    padding:30,
    justifyContent:"center",
  },
  textBottom: {
    textDecorationColor:"white",
    margin:30,
    padding:30,
    position: 'absolute', 
    bottom: 10, 
  },
  textinput: {
    alignItems: 'stretch',
    textDecorationColor:"white",
    margin:30,
    padding:10,
    borderWidth:1,
    borderColor:"white",
    color:"white",
  },
  button: {
    color: '#677ea3',
  },
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: '#161b22',
    justifyContent: "center", 
    alignItems: "stretch",
    textDecorationColor:"white",
  },
  scrollContainer:{
    flex: 1,
    padding: 5,
    backgroundColor: '#161b22',
    textDecorationColor:"white",
  },
  header: {  
    flex: 1,  
    alignItems: 'center',  
    justifyContent: 'center',  
    backgroundColor: '#677ea3', 
    textDecorationColor:"white",
    color:"white", 
  }, 
  title: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#61dafb',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  text:{
    color:"white",
    fontSize:20,
  },
  pressable:{    
    backgroundColor: "#677ea3",
    borderColor: "#677ea3",
    borderWidth: 1,
    borderStyle: "solid",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical:12,
},
  menu:{
    fontSize: 35,
  }
});

export default styles;


/*const styles = StyleSheet.create({  
  container: {  
    flex: 1,  
    alignItems: 'center',  
    justifyContent: 'center',  
    backgroundColor: '#ecf0f1',  
  }, 
  header: {  
    flex: 1,  
    alignItems: 'center',  
    justifyContent: 'center',  
    backgroundColor: '#677ea3',  

  },   
  modal: {  
  justifyContent: 'center',  
  alignItems: 'center',   
  backgroundColor : "#00BCD4",  
  height: 300 ,  
  width: '80%',  
  borderRadius:10,  
  borderWidth: 1,  
  borderColor: '#fff',    
  marginTop: 80,  
  marginLeft: 40,  
   
   },  
   text: {  
      color: '#3f2949',  
      marginTop: 10  
   }  
});  */