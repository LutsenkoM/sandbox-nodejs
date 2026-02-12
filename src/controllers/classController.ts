import { Request, Response, NextFunction } from 'express';
import * as classService from '../services/classService';
import { ApiError } from '../errors/ApiError';

export async function createMessage(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const { classId } = req.params;
    const { text } = req.body;

    const message = await classService.createMessage(classId, req.user.id, text);
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
}

export async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const { classId } = req.params;
    const messages = await classService.getMessages(classId);
    res.json(messages);
  } catch (error) {
    next(error);
  }
}

export async function getClass(req: Request, res: Response, next: NextFunction) {
  try {
    const { classId } = req.params;
    const classObj = await classService.getClass(classId);
    res.json(classObj);
  } catch (error) {
    next(error);
  }
}

