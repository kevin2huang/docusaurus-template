import React, {type ComponentProps} from 'react';
import Container from '@theme-original/CodeBlock/Container';
import type ContainerType from '@theme/CodeBlock/Container';
import styles from './styles.module.css';

type Props = ComponentProps<typeof ContainerType>;

export default function ContainerWrapper(props: Props): React.JSX.Element {
  return (
    <div
      className={styles.codeBlockContainer}
      style={
        {
          '--prism-color': '#fcfcfa',
          '--prism-background-color': '#2d2a2e',
        } as React.CSSProperties
      }>
      <Container {...props} />
    </div>
  );
}
