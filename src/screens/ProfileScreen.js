import { View, Text,StyleSheet,Image,FlatList,TouchableOpacity, ScrollView,SafeAreaView ,Switch} from 'react-native'
import React ,{useState,useContext,useEffect}from 'react'
import { Ionicons,Entypo,MaterialCommunityIcons,MaterialIcons,FontAwesome6,FontAwesome } from '@expo/vector-icons';




export default function ProfileScreen() {
  
  
  const [isDarkMode, setisDarkMode] = useState(false);


  return (

    <View style={styles.container}>
      <ScrollView >
       <View style={styles.ProfileMainContainer}>
              <View style={styles.ProfileContainer}>
                  <Image source={require("../../assets/img.png")} style={styles.userimage} />
                  <View style={{marginTop:15,  gap:4,}}>
                       <Text style={{ fontSize: 18, fontFamily: 'oufit', color: "#000000" ,fontWeight:"700",lineHeight:24.3}}>Leonard Victor</Text>
                       <Text style={{ width: 198, height: 18,  setIsRecordingfontSize: 13, }}>ID: Leonardvictor694@gmail.com</Text>
                  </View>
                   </View>
          </View>
          
        

          
         
          <TouchableOpacity style={{  borderRadius: 8, height: 56, width: 350, alignItems: "center",justifyContent:"center", padding: 10,paddingTop:-190,marginTop:100,marginBottom:50,display:"flex",flexDirection:"row",gap:100}}  >
          <Image source={require("../../assets/img.png")} style={{marginLeft:-100, width:24,
  height:24,}} />
          <Text style={styles.buttonText}>Sign Out</Text>
</TouchableOpacity>

          </ScrollView>

    </View>
  )
}
const styles = StyleSheet.create({
  container: {
   
     flex: 1,
      padding: 29
  },
userimage2:{
  width:24,
  height:24,
  borderRadius:20
 
},
userimage:{
  width:80,
  height:80,
  borderRadius:40
 
},image:{width:24,
  height:24,
},

ProfileMainContainer:{
    
  display:"flex",
  flexDirection:"row",
  alignContent:"center",
  justifyContent:"space-between",
  
  gap:167,
  marginTop:60,marginLeft:20,
  width:350,height:42
},
ProfileContainer:{
  display:"flex",
  flexDirection:"row",
  alignContent:"center",
  gap:9,
  padding:2,
  //backgroundColor:"red",
  //borderRadius:8
}, subcontainer:{
  display:"flex",
  flexDirection:"column",
  width:100,
  height:39,
  gap:2,
  marginLeft:3,},
  
  container2:{
    // backgroundColor:"red",
    marginTop:9,
    marginBottom:9,
        flexDirection:"row",
        width:141,
        height:39,
        
     },
     
  buttonText:{
    color:"#FF0000",
    size:14,
    lineHeight:18.9,
    fontWeight:"700",
    marginLeft:-79,
    marginRight:69
    },
  
})