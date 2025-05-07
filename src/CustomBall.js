import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

export default function Basketball({ size, style }) {
    const r = size / 2;
    const strokeW = size * 0.08;

    return (
        <Svg width={size} height={size} style={style}>

            <Circle cx={r} cy={r} r={r} fill={'#3498db'} />

            <Path
                d={`
                M 0 ${r}
                Q ${r * 0.5} ${r * 0.2}, ${r} ${r}
                T ${size} ${r}
                `}
                stroke='#ecf0f1'
                strokeWidth={strokeW}
                fill='none'
            />
            <Path
                d={`
                M ${strokeW / 2} ${r}
                Q ${r * 0.8} ${r * 0.5}, ${r} ${r}
                T ${r} ${size}
                `}
                stroke='#ecf0f1'
                strokeWidth={strokeW}
                fill='none'
            />

            <Circle cx={r} cy={r} r={strokeW * 1.2} fill='#ecf0f1' />
        </Svg>
    )
}