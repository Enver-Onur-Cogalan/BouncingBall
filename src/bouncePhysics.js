import { Dimensions } from "react-native";
import { withTiming } from "react-native-reanimated";

let rafId = null;

function safeCancel() {
    'worklet';

    if (rafId != null && typeof rafId === 'number') {
        try {
            cancelAnimationFrame(rafId);
        } catch (e) {

        }
        rafId = null;
    }
}

export function bouncePhysics(positionX, positionY, velocityX, velocityY, config = {}) {
    'worklet';

    // Destructure configuration with defaults
    const gravity = config.gravity ?? 0.98;
    const friction = config.friction ?? 0.98;
    const bounce = config.bounce ?? 0.7;
    const BALL_SIZE = config.ballSize ?? 60;
    const safeOffset = BALL_SIZE / 2;

    // Define boundaries based on screen size or config
    const minX = config.minX ?? 0;
    const maxX = config.maxX ?? Dimensions.get('window').width - safeOffset;
    const minY = config.minY ?? safeOffset;
    const maxY = config.maxY ?? Dimensions.get('window').height - BALL_SIZE;

    // Retrieve optional shared values for scaling, dragging state, and spin
    const scaleX = config.scaleX;
    const scaleY = config.scaleY;
    const isDragging = config.isDragging;
    const isGrounded = config.isGrounded;
    const rotation = config.rotation;
    const spinFactor = config.spinFactor ?? 0.5;

    safeCancel();


    const frame = () => {
        if (isDragging.value) {
            safeCancel();
            return;
        }

        // Apply gravity and a small extra force for more dynamic bounce
        velocityY.value += gravity + Math.abs(velocityY.value) * 0.001;

        const airFriction = 1 - (positionY.value / maxY) * 0.02;
        velocityX.value *= airFriction;

        positionX.value += velocityX.value;
        positionY.value += velocityY.value;

        // Handle left/right boundary bounce
        if (positionX.value < minX) {
            positionX.value = minX;
            velocityX.value *= -bounce;
            velocityX.value *= friction;
            if (!isDragging.value && scaleX && scaleY) {
                scaleY.value = 0.8;
                scaleX.value = 1.2;
                scaleY.value = withTiming(1, { duration: 150 });
                scaleX.value = withTiming(1, { duration: 150 });
            }
        } else if (positionX.value > maxX) {
            positionX.value = maxX;
            velocityX.value *= -bounce;
            velocityX.value *= friction;
            if (!isDragging.value && scaleX && scaleY) {
                scaleY.value = 0.8;
                scaleX.value = 1.2;
                scaleY.value = withTiming(1, { duration: 150 });
                scaleX.value = withTiming(1, { duration: 150 });
            }
        }

        // Handle top boundary bounce
        if (positionY.value < minY) {
            positionY.value = minY;
            velocityY.value *= -bounce;
            if (!isDragging.value && scaleX && scaleY) {
                scaleY.value = 0.8;
                scaleX.value = 1.2;
                scaleY.value = withTiming(1, { duration: 150 });
                scaleX.value = withTiming(1, { duration: 150 });
            }
        } else if (positionY.value > maxY) {
            positionY.value = maxY;
            velocityY.value *= -bounce;
            velocityX.value *= friction;

            if (!isDragging.value && !isGrounded.value && scaleX && scaleY) {
                scaleY.value = withTiming(0.8, { duration: 100 });
                scaleX.value = withTiming(1.2, { duration: 100 });
                scaleY.value = withTiming(1, { duration: 150 });
                scaleX.value = withTiming(1, { duration: 150 });
            }
            if (isGrounded) isGrounded.value = true;
        }

        // Check if the ball has effectively stopped moving
        const stopped =
            Math.abs(velocityX.value) < 0.2 &&
            Math.abs(velocityY.value) < 0.2 &&
            positionY.value >= maxY;

        if (stopped) {
            safeCancel();
            return;
        }

        const next = requestAnimationFrame(frame);
        if (typeof next === 'number') rafId = next;
    };

    // Start the physics loop
    const first = requestAnimationFrame(frame);
    if (typeof first === 'number') rafId = first;

    return rafId;
}
