import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Storage from '../database/Storage';

const storage = new Storage();

let foregroundSubscription = null;

export default function MapScreen({ navigation }) {
    const [trace, setTrace] = useState([])
    const [position, setPosition] = useState(null)
    const [intervalId, setIntervalId] = useState(null);
    const [flagUpdatePosition, setFlagUpdatePosition] = useState(false)
    const [mapRegion, setMapRegion] = useState({
        latitude: null,
        longitude: null,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009,
    });


    useEffect(() => {
        const requestPermission = async () => {
            const foreground = await Location.requestForegroundPermissionsAsync();
        }
        requestPermission();
    }, []);

    useEffect(() => {
        getPosition();
    }, [flagUpdatePosition])


    const getPosition = async () => {
        if (flagUpdatePosition) {
            const newIntervalId = setInterval(startForegroundUpdate, 5000);
            setIntervalId(newIntervalId);
        } else {
            clearInterval(intervalId);
        }
    };

    const handleFlagUpdatePosition = () => {
        setFlagUpdatePosition(!flagUpdatePosition)
    }

    let interval = null;


    const startForegroundUpdate = async () => {
        const { granted } = await Location.getForegroundPermissionsAsync();
        if (!granted) {
            console.log("Location permission not granted.");
            return;
        }

        if (foregroundSubscription) {
            foregroundSubscription.remove();
        }

        foregroundSubscription = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.Highest },
            (location) => {
                setPosition(location.coords);

                const { latitude, longitude } = location.coords;
                const latitudeDelta = 0.009;
                const longitudeDelta = 0.009;

                console.log("Received location: ", latitude, longitude);

                setMapRegion({
                    latitude,
                    longitude,
                    latitudeDelta,
                    longitudeDelta,
                });

                setTrace(prevTrace => [
                    ...prevTrace,
                    { latitude, longitude }
                ]);

                storage.save(Math.random(), { latitude, longitude });
            }
        );
    };


    return (
        <View style={styles.container}>
            <MapView style={styles.map} region={mapRegion}>
                {
                    trace.length > 1 &&
                    <Polyline
                        coordinates={trace}
                        strokeColor={"#000"}
                        strokeWidth={3}
                        lineDashPattern={[1]}
                    />}
            </MapView>
            <Button
                onPress={() => handleFlagUpdatePosition()}
                title={flagUpdatePosition ? "Parar rastreamento" : "Iniciar rastreamento"}
                color={flagUpdatePosition ? "red" : "green"}
            />
            
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
