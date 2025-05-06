import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, useAnimatedGestureHandler } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

import { bouncePhysics } from './bouncePhysics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const BALL_SIZE = 60;

export default function DragAndThrowBall() {
    const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width);
    const [containerHeight, setContainerHeight] = useState(Dimensions.get('window').height);

    const positionX = useSharedValue(containerWidth / 2 - BALL_SIZE / 2);
    const positionY = useSharedValue(containerHeight / 2 - BALL_SIZE / 2);
    const velocityX = useSharedValue(0);
    const velocityY = useSharedValue(0);
    const scaleX = useSharedValue(1);
    const scaleY = useSharedValue(1);
    const isDragging = useSharedValue(false);
    const isGrounded = useSharedValue(false);

    const insets = useSafeAreaInsets();


    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.startX = positionX.value;
            ctx.startY = positionY.value;

            isDragging.value = true;
            isGrounded.value = false;
            velocityX.value = 0;
            velocityY.value = 0;
        },
        onActive: (event, ctx) => {
            positionX.value = ctx.startX + event.translationX;
            positionY.value = ctx.startY + event.translationY;
        },
        onEnd: (event) => {
            velocityX.value = event.velocityX / 15;
            velocityY.value = event.velocityY / 15;

            isDragging.value = false;

            if (Math.abs(velocityX.value) < 5 && Math.abs(velocityY.value) < 5) return;


            bouncePhysics(positionX, positionY, velocityX, velocityY, {
                minX: 0,
                maxX: containerWidth - BALL_SIZE,
                minY: insets.top + BALL_SIZE / 2,
                maxY: containerHeight - BALL_SIZE,
                ballsize: BALL_SIZE,
                scaleX: scaleX,
                scaleY: scaleY,
                isDragging: isDragging,
                isGrounded: isGrounded,
            });
        },
    });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: positionX.value },
            { translateY: positionY.value - BALL_SIZE / 2 },
            { scaleX: scaleX.value },
            { scaleY: scaleY.value },
        ],
    }));

    return (
        <View
            style={styles.container}
            onLayout={(e) => {
                setContainerWidth(e.nativeEvent.layout.width);
                setContainerHeight(e.nativeEvent.layout.height);
            }}
        >
            <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View style={[styles.ball, animatedStyle]} />
            </PanGestureHandler>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111',
        overflow: 'hidden',
    },
    ball: {
        position: 'absolute',
        width: BALL_SIZE,
        height: BALL_SIZE,
        borderRadius: BALL_SIZE / 2,
        backgroundColor: 'greenyellow',
    },
});

