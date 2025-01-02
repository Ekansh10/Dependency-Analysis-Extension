import * as fs from 'fs';
import * as path from 'path';
import { Element } from '../views/tree/tokens/root';

// Function to recursively return elements with the index `className`
export default function findElementsWithClassName(element: Element): Element[] {
  let classNameList: Element[] = [];
  
  if(element.class && element.name) {
    classNameList.push(element);
  }
  
  if (element.elements) {
    for (const childElement of element.elements) {
      const elements = findElementsWithClassName(childElement);
      for(const elem of elements) {
        classNameList.push(elem);
      }
    }
  }
  
  return classNameList;
}