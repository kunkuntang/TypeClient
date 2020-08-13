import React from 'react';
import { ClassMetaCreator } from "@typeclient/core";
import { injectable } from 'inversify';
import {  NAMESPACE} from './namespace';

const stacks = new WeakMap<object, React.FunctionComponent<any>>();

export function Component() {
  return ClassMetaCreator.join(
    (target: any) => {
      const fn = target.prototype.render;
      if (!fn) throw new Error('component must be a render function in class object');
    },
    injectable(),
    ClassMetaCreator.define(NAMESPACE.COMPONENT, true)
  )
}

export declare class ComponentTransform {
  public render(props: any): React.ReactElement;
}

export function useComponent<T extends ComponentTransform>(component: T): T['render'] {
  const constructor = component.constructor;
  const instance = ClassMetaCreator.instance(constructor);
  const isComponent = instance.got(NAMESPACE.COMPONENT, false);
  if (!isComponent) throw new Error('component is not an iocComponent');
  if (stacks.has(component)) return stacks.get(component);
  const fn = component.render.bind(component);
  stacks.set(component, fn);
  return fn;
}