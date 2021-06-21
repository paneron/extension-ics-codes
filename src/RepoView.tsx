/** @jsx jsx */

import log from 'electron-log';
import { jsx } from '@emotion/react';

Object.assign(console, log);

import { RegistryView } from '@riboseinc/paneron-registry-kit/views';
import { itemClassConfiguration } from './registryConfig';


export default function () {
  return <RegistryView itemClassConfiguration={itemClassConfiguration} />
};
