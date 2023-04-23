import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

import Storage from '../database/Storage';

const storage = new Storage();

let foregroundSubscription = null;

export default function MapScreen({ navigation }) {
    const [mapRegion, setMapRegion] = useState({
        latitude: -21.7465511,
        longitude: -43.3592681,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009,
    });
    const [position, setPosition] = useState(null)

    useEffect(() => {
        const requestPermission = async () => {
            const foreground = await Location.requestForegroundPermissionsAsync();
        }
        requestPermission();

        setInterval(startForegroundUpdate, 10000);
    }, []);

    const startForegroundUpdate = async () => {
        const { granted } = await Location.getForegroundPermissionsAsync()
        if (!granted) {
            console.log("Location permission not granted.")
            return
        }

        if (foregroundSubscription) {
            foregroundSubscription.remove();
        }

        foregroundSubscription = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.Highest },
            (location) => {
                setPosition(location.coords)

                const { latitude, longitude } = location.coords;
                const latitudeDelta = 0.009;
                const longitudeDelta = 0.009;

                console.log("Received location: ", latitude, longitude)

                setMapRegion({
                    latitude,
                    longitude,
                    latitudeDelta,
                    longitudeDelta,
                })

                storage.save(Math.random(), { latitude, longitude })
            }
        )
    }


    return (
        <View style={styles.container}>
            <MapView style={styles.map} region={mapRegion}>

            </MapView>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        alignSelf: 'stretch',
        height: '80%'
    }
})