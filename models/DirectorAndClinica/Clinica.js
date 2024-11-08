const { Schema, model, Types } = require("mongoose");
const Joi = require("joi");

const CLINICA_APPEARANCE_DEFAULT = {
  showStationary: true,
  showCashbox: true,
};

const clinica = new Schema(
  {
    name: { type: String, required: true },
    name2: { type: String },
    site: { type: String },
    organitionName: { type: String },
    image: { type: String, required: true },
    ad: { type: String, required: false, default: null },
    blanka: { type: String, required: false },
    phone1: { type: String, required: true },
    phone2: { type: String },
    phone3: { type: String },
    bank: { type: String },
    bankNumber: { type: String },
    license: { type: String },
    header: { type: String },
    ifud1: { type: String },
    ifud2: { type: String },
    ifud3: { type: String },
    inn: { type: Number },
    telegramId: { type: String },
    mainclinica: { type: Boolean, default: false },
    filials: [{ type: Schema.Types.ObjectId, ref: "Clinica" }],
    isFilial: { type: Boolean, default: false },
    mfo: { type: Number },
    address: { type: String },
    smsKey: { type: String },
    telegram:{type:String,required:false},
    instagram:{type:String,required:false},
    orientation: { type: String },
    isClose: { type: Boolean, default: false },
    close_date: { type: Date },
    isCreateUser: { type: Boolean, default: false },
    isArchive: { type: Boolean, default: false },
    reseption_and_pay: { type: Boolean, default: false },
    turnCheckVisible: { type: Boolean, default: false },
    connectorDoctor_client: { type: Boolean, default: false },
    NDS:{type:Number,default:0,required:false},
    requiredFields: {
      type: Map,
      of: Boolean,
      default: {
        fathername: true,
        gender: true,
        phone: true,
        address: true,
        born: true,
        nation: true,
      },
    },
    appearanceFields: {
      type: Map,
      of: Boolean,
      default: { ...CLINICA_APPEARANCE_DEFAULT },
    },
  },
  {
    timestamps: true,
  }
);

function validateClinica(clinica) {
  const schema = Joi.object({
    name: Joi.string().required(),
    name2: Joi.string(),
    organitionName: Joi.string(),
    image: Joi.string().required(),
    ad: Joi.string().optional().allow(null).default(null),
    blanka: Joi.string().optional(),
    phone1: Joi.string().required(),
    turnCheckVisible: Joi.boolean().default(false),
    phone2: Joi.string(),
    phone3: Joi.string(),
    bank: Joi.string(),
    bankNumber: Joi.string(),
    inn: Joi.number(),
    mfo: Joi.number(),
    mainclinica: Joi.boolean(),
    filials: Joi.array(),
    isFilial: Joi.boolean(),
    address: Joi.string(),
    smsKey: Joi.string().optional(),
    orientation: Joi.string(),
    license: Joi.string(),
    site: Joi.string(),
    ifud1: Joi.string(),
    ifud2: Joi.string(),
    ifud3: Joi.string(),
    telegramId: Joi.string(),
    close_date: Joi.date().optional(),
    instagram:Joi.string().optional(),
    telegram:Joi.string().optional(),
    close_date: Joi.date().optional(),
    NDS:Joi.number().default(0).optional()
    // isCreateUser: Joi.boolean().optional(),
  });

  return schema.validate(clinica);
}

module.exports.validateClinica = validateClinica;
module.exports.Clinica = model("Clinica", clinica);
module.exports.CLINICA_APPEARANCE_DEFAULT = CLINICA_APPEARANCE_DEFAULT;
