import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Storage {
    
    async save(key, value) {
        await AsyncStorage.setItem(key.toString(), JSON.stringify(value));
    }

    async listContent(){
        const keys = await AsyncStorage.getAllKeys();
        const result = await AsyncStorage.multiGet(keys);

        return result
    }

    async clearContent(){
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(keys);
    }

    async load(key) {
        const value = await AsyncStorage.getItem(key.toString());
        return JSON.parse(value);
    }
}