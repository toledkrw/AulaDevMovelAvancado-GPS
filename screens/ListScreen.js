import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Storage from "../database/Storage"

const storage = new Storage();

export default ListScreen = ({ navigation }) => {
    const [contents, setContents] = useState([])

    useEffect(() => {
        navigation.addListener('focus', () => onUpdate())
    }, [])

    const onUpdate = (() => {
        storage.listContent().then((stores) => {
            let contents = [];
            if (stores) {
                stores.forEach(element => {
                    let id = element[0]
                    if (id != "SnackDeviceId" && id != "EXPO_CONSTANTS_INSTALLATION_ID") {
                        let data = JSON.parse(element[1])

                        if (data != null) {
                            let { latitude, longitude } = data
                            contents.push({ id, latitude, longitude })
                        }
                    }

                });
                setContents(contents)
            }
        })
    })

    const renderContent = (() => {
        return (
            contents.map((content, index) => {
                return (
                    <Text>{content.latitude} - {content.longitude}</Text>
                )
            })
        )
    })



    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                {renderContent()}
            </ScrollView>
            <Button
                onPress={
                    () => {
                        storage.clearContent()
                        navigation.navigate('MapScreen')
                    }
                }
                title="Clear"
                color="red"
            />
        </View>
    )
}
