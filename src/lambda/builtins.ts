import * as L from "./lang";
import * as R from "./reduce";
import * as Maybe from "../util/Maybe"

export const lessThan: L.Func = {
  kind: "func",
  name: "<",
  arity: 2,
  body: function(args: L.Expr[]): L.Expr {
    const arg1 = args[0]
    const arg2 = args[1]

    const arg1R = R.reduce1(arg1)
    if (Maybe.isJust(arg1R)) {
      return L.mkPApp(this, [arg1R, arg2])
    } else if (arg1.kind !== 'num') {
      throw new Error('<: Expecting numeric arguments, got: ' + arg1)
    }

    const arg2R = R.reduce1(arg2)
    if (Maybe.isJust(arg2R)) {
      return L.mkPApp(this, [arg1, arg2R])
    } else if (arg2.kind !== 'num') {
      throw new Error('<: Expecting numeric arguments, got: ' + arg2)
    }

    return L.mkBool(arg1.value < arg2.value)
  }
}

