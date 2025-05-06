import { Dimensions } from "react-native";
import { withTiming } from "react-native-reanimated";

export function bouncePhysics(positionX, positionY, velocityX, velocityY, config = {}) {
    'worklet';

    const gravity = config.gravity ?? 0.98;
    const friction = config.friction ?? 0.98;
    const bounce = config.bounce ?? 0.7;
    const BALL_SIZE = config.ballSize ?? 60;
    const safeOffset = BALL_SIZE / 2;

    const minX = config.minX ?? 0;
    const maxX = config.maxX ?? Dimensions.get('window').width - safeOffset;
    const minY = config.minY ?? safeOffset;
    const maxY = config.maxY ?? Dimensions.get('window').height - BALL_SIZE;

    const scale = config.scale;
    const scaleX = config.scaleX;
    const scaleY = config.scaleY;
    const isDragging = config.isDragging;
    const isGrounded = config.isGrounded;


    let animating = true;

    if (config.isDragging?.value === true) {
        animating = false;
    }

    const frame = () => {
        if (!animating) return;

        velocityY.value += gravity;

        positionX.value += velocityX.value;
        positionY.value += velocityY.value;

        if (positionX.value < minX) {
            positionX.value = minX;
            velocityX.value *= -bounce;
            velocityX.value *= friction;
            if (!isDragging.value && scaleX && scaleY) {
                scaleY.value = 0.9;
                scaleX.value = 1.05;
                scaleY.value = withTiming(1, { duration: 150 });
                scaleX.value = withTiming(1, { duration: 150 });
            }
        } else if (positionX.value > maxX) {
            positionX.value = maxX;
            velocityX.value *= -bounce;
            velocityX.value *= friction;
            if (!isDragging.value && scaleX && scaleY) {
                scaleY.value = 0.9;
                scaleX.value = 1.05;
                scaleY.value = withTiming(1, { duration: 150 });
                scaleX.value = withTiming(1, { duration: 150 });
            }
        };

        if (positionY.value < minY) {
            positionY.value = minY;
            velocityY.value *= -bounce;
            if (!isDragging.value && scaleX && scaleY) {
                scaleY.value = 0.9;
                scaleX.value = 1.05;
                scaleY.value = withTiming(1, { duration: 150 });
                scaleX.value = withTiming(1, { duration: 150 });
            }
        } else if (positionY.value > maxY) {
            positionY.value = maxY;
            velocityY.value *= -bounce;
            velocityX.value *= friction;

            if (!isDragging.value && !isGrounded.value && scaleX && scaleY) {
                scaleY.value = 0.9;
                scaleX.value = 1.05;
                scaleY.value = withTiming(1, { duration: 150 });
                scaleX.value = withTiming(1, { duration: 150 });
            }
            if (isGrounded) isGrounded.value = true;
        };

        const stopped =
            Math.abs(velocityX.value) < 0.2 &&
            Math.abs(velocityY.value) < 0.2 &&
            positionY.value >= maxY;

        if (stopped) {
            velocityX.value = 0;
            velocityY.value = 0;
            animating = false;
            return;
        }
        requestAnimationFrame(frame);
    };

    requestAnimationFrame(frame);
}
