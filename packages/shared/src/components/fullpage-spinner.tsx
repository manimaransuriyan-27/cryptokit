import type { SpinProps } from 'antd';
import { Spin } from 'antd';

const stylesObject: SpinProps['styles'] = {
  indicator: {
    color: '',
  },
};

export function FullPageSpinner({ ...props }: SpinProps) {
  return <Spin {...props} styles={stylesObject} />;
}
