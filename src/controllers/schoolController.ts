import { Request, Response, NextFunction } from 'express';
import * as schoolService from '../services/schoolService';
import { ApiError } from '../errors/ApiError';

export async function createSchool(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const { name } = req.body;
    const school = await schoolService.createSchool(name, req.user.id);
    res.status(201).json(school);
  } catch (error) {
    next(error);
  }
}

export async function inviteSchoolAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const { schoolId } = req.params;
    const { email, expiresInHours } = req.body;

    const result = await schoolService.inviteSchoolAdmin(
      schoolId,
      email,
      expiresInHours,
      req.user.id
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function createClass(req: Request, res: Response, next: NextFunction) {
  try {
    const { schoolId } = req.params;
    const { name } = req.body;

    const classObj = await schoolService.createClass(schoolId, name);
    res.status(201).json(classObj);
  } catch (error) {
    next(error);
  }
}

export async function inviteToSchool(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw ApiError.unauthorized();
    }

    const { schoolId } = req.params;
    const { email, role, classId, expiresInHours } = req.body;

    const result = await schoolService.inviteToSchool(
      schoolId,
      email,
      role,
      classId,
      expiresInHours,
      req.user.id
    );

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getSchool(req: Request, res: Response, next: NextFunction) {
  try {
    const { schoolId } = req.params;
    const school = await schoolService.getSchool(schoolId);
    res.json(school);
  } catch (error) {
    next(error);
  }
}

export async function getAllSchools(req: Request, res: Response, next: NextFunction) {
  try {
    const schools = await schoolService.getAllSchools();
    res.json(schools);
  } catch (error) {
    next(error);
  }
}

export async function getSchoolClasses(req: Request, res: Response, next: NextFunction) {
  try {
    const { schoolId } = req.params;
    const classes = await schoolService.getSchoolClasses(schoolId);
    res.json(classes);
  } catch (error) {
    next(error);
  }
}
