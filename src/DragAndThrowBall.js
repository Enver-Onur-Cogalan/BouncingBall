import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, useAnimatedGestureHandler, withDecay } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { bouncePhysics } from './bouncePhysics';
import Basketball from './CustomBall';


const BALL_SIZE = 60;

export default function DragAndThrowBall() {
    // State to hold container dimensions
    const [containerWidth, setContainerWidth] = useState(Dimensions.get('window').width);
    const [containerHeight, setContainerHeight] = useState(Dimensions.get('window').height);

    const rafRef = useRef(null);

    // Shared values: values ​​tracked with reanimated values
    const positionX = useSharedValue(containerWidth / 2 - BALL_SIZE / 2);
    const positionY = useSharedValue(containerHeight / 2 - BALL_SIZE / 2);
    const velocityX = useSharedValue(0);
    const velocityY = useSharedValue(0);
    const scaleX = useSharedValue(1);
    const scaleY = useSharedValue(1);
    const isDragging = useSharedValue(false);
    const isGrounded = useSharedValue(false);
    const rotation = useSharedValue(0);

    const insets = useSafeAreaInsets();


    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            if (rafRef.current !== null) {
                try { cancelAnimationFrame(rafRef.current) } catch { }
                rafRef.current = null;
            }
            rotation.value = 0;
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
            if (rafRef.current !== null) {
                try { cancelAnimationFrame(rafRef.current) } catch { }
                rafRef.current = null;
            }

            if (Math.abs(event.velocityX) < 500 && Math.abs(event.velocityY) < 500) {
                velocityX.value = 0;
                velocityY.value = 0;
                isDragging.value = false;
                return;
            }
            velocityX.value = event.velocityX / 15;
            velocityY.value = event.velocityY / 15;
            isDragging.value = false;

            rotation.value = withDecay({
                velocity: event.velocityX * 0.02,
                deceleration: 0.998,
            });

            rafRef.current = bouncePhysics(
                positionX, positionY, velocityX, velocityY,
                {
                    minX: 0,
                    maxX: containerWidth - BALL_SIZE,
                    minY: insets.top + BALL_SIZE / 2,
                    maxY: containerHeight - BALL_SIZE,
                    ballsize: BALL_SIZE,
                    scaleX: scaleX,
                    scaleY: scaleY,
                    isDragging: isDragging,
                    isGrounded: isGrounded,
                    rotation: rotation,
                    spinFactor: 4,
                }
            );
        },
    });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: positionX.value },
            { translateY: positionY.value - BALL_SIZE / 2 },
            { scaleX: scaleX.value },
            { scaleY: scaleY.value },
            { rotateZ: `${rotation.value}deg` },
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
                <Animated.View style={[styles.ball, animatedStyle]}>
                    <Basketball size={BALL_SIZE} />
                </Animated.View>
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
        position: 'absolute',  //For free movement
        width: BALL_SIZE,
        height: BALL_SIZE,
    },
});

