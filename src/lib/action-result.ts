export type ActionResult<T, TCode extends string = string> =
   | {
      success: true;
      data: T;
      message: string;
   }
   | {
      success: false;
      code: TCode;
      message: string;
   };

type ActionSuccess<T> = {
   success: true;
   data: T;
   message: string;
};

type ActionFailure<TCode extends string> = {
   success: false;
   code: TCode;
   message: string;
};

export function actionSuccess<T>(
   data: T,
   message: string,
): ActionSuccess<T> {
   return {
      success: true,
      data,
      message,
   };
}

export function actionFailure<TCode extends string>(
   code: TCode,
   message: string,
): ActionFailure<TCode> {
   return {
      success: false,
      code,
      message,
   };
}
