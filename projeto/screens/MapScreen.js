import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

import Storage from '../database/Storage';

const storage = new Storage();
