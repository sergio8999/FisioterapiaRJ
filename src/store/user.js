import { auth } from '../db.js'
import firebase from 'firebase/app'

const state = {
    user:null,
};

const getters = {};

const mutations = {
    setUser(state, user){
        state.user = user;
    },
    setIsAdmin(state, isAdmin){
        state.isAdmin = isAdmin;
    }
};

const actions = {
    async login({ commit }, { email, password, red }){
        let provider;
        if(red == "email")
            await auth.signInWithEmailAndPassword(email,password);
        else{
            provider = new firebase.auth.GoogleAuthProvider(); 
            await firebase.auth().signInWithPopup(provider);
        }    
        commit('setUser', auth.currentUser);
    },
    async register({ commit }, {name, email, password}){
        await auth.createUserWithEmailAndPassword(email, password);
        const user = auth.currentUser;
        user.updateProfile({
            displayName: name
        });
        commit('setUser', user);
    },
    async logout({ commit }){
        await auth.signOut();
        commit('setUser', null);
    },

    async checkEmail(){
        const user = auth.currentUser;
        await user.sendEmailVerification();
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};