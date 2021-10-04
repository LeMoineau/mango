
import { AlertController } from '@ionic/angular';
import { DataObject } from './objects';

export function isObject(target: any) {
  return (target !== null && typeof(target) === "object" && !Array.isArray(target))
}

export function copyStructureOf(objToCopy: DataObject) {

  let res = {};
  for (let key in objToCopy) {
    if (isObject(objToCopy[key])) {
      res[key] = copyStructureOf(objToCopy[key]);
    } else {
      res[key] = objToCopy[key];
    }
  }
  return res;

}

export function copyObject(obj: DataObject) {
  return JSON.parse(JSON.stringify(obj));
}

export function concatener(list1: DataObject, list2: DataObject) {

  list2 = copyObject(list2);
  for (let field in list2) {
    const l2 = list2[field];
    if (list1[field] !== undefined && list1[field].length > 0) {
      let l1 = list1[field];
      if (typeof(l1) !== "object" && typeof(l2) === "object") {
        list1[field] = l2.concat(l1);
      } else if (typeof(l1) === "object" && typeof(l2) !== "object") {
        list1[field] = l1.concat(l2);
      } else if (typeof(l1) === "object" && typeof(l1) === typeof(l2)) {
        list1[field] = l1.concat(l2);
      } else if (!l1.includes(l2) && !l2.includes(l1)) {
        list1[field] = [l1, l2];
      }
    } else {
      list1[field] = l2
    }
  }
  return list1

}

export function getLastWordOfSentence(sentence: string) {
  return getLastOfSplit(sentence, " ");
}

export function getLastOfSplit(sentence: string, spliter: string) {
  let tmp = sentence.split(spliter);
  return tmp[tmp.length - 1];
}

export function replaceWhitespaceByTiret6(str: string) {
  return str.toLowerCase().split(".").join(" ").split(" ").join("-")
}

export function replaceWhitespaceByTiret8(str: string) {
  return str.toLowerCase().split(".").join(" ").split(" ").join("_")
}

export function getExtensionOfImageUrl(url: string) {
  const urlSplited = url.split(".");
  return urlSplited[urlSplited.length - 1];
}

export function getRandomNumber(max: number) {
  return Math.floor(Math.random() * max);
}
