const { Schema, model } = require("mongoose");
const Joi = require("joi");

const department = new Schema(
  {
    name: { type: String, required: true },
    probirka: { type: Boolean, required: true, default: false },
    clinica: { type: Schema.Types.ObjectId, ref: "Clinica", required: true },
    services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    servicetypes: [{ type: Schema.Types.ObjectId, ref: "ServiceType" }],
    doctor: { type: Schema.Types.ObjectId, ref: "User" },
    letter: { type: String },
    floor: { type: String },
    stopTurn: { type: Boolean, default: false },
    room: { type: Number },
    workStart: { type: String },
    waitingTime: { type: Number },
    isArchive: { type: Boolean, default: false },
    departmentRooms: { type: Array, default: [] },
    dayMaxTurns: { type: Number, default: 0 },
    takenTurns: { type: [Number], default: [] },
  },
  {
    timestamps: true,
  }
);

function validateDepartment(department) {
  const schema = Joi.object({
    name: Joi.string().required(),
    room: Joi.number(),
    departmentRooms: Joi.array()
      .items(
        Joi.object({
          type: Joi.string().required(),
          number: Joi.number().required(),
        }).optional()
      )
      .optional(),
    letter: Joi.string().optional(),
    stopTurn: Joi.boolean().optional(),
    floor: Joi.string().optional(),
    probirka: Joi.boolean().required(),
    workStart: Joi.string().optional(),
    waitingTime: Joi.number().optional(),
    clinica: Joi.string().required(),
    dayMaxTurns: Joi.number().optional(),
    takenTurns: Joi.array().items(Joi.number()).optional(),
  });

  return schema.validate(department);
}

module.exports.validateDepartment = validateDepartment;
module.exports.Department = model("Department", department);
