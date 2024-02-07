
import { Store, registerInDevtools } from "pullstate";


export const AuthStore = new Store({
  isLoggedIn: false,
  userData: null,
  sendMessage:null,
  lastMessage:null,
  readyState:null,
  messages:null,
  markedDates:null,
  oraganiseData:[{id:1,title:"Getting things ready"}],
  analysedData:null, //{id:{all the stuff}}
  tempToken:null,
  justLoggedOut:false,
});

registerInDevtools({AuthStore});