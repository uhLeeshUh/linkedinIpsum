import { Transaction } from "objection";
import Template from "../models/template";
import { isEmpty } from "lodash";
import Industry from "../models/industry";
import IndustryTemplate from "../models/industry-template";
import TemplateChunk, {
  ITemplateChunkCreateFields,
} from "../models/template-chunk";
import Variable from "../models/variable";
import VariableCategory from "../models/variable-category";

type IndustryType = "finance" | "tech" | "advertising" | "consulting";

interface IVariable {
  variableText: string;
  isPreferred?: boolean;
}

interface ITemplateChunkBase {
  chunkText: string;
}

interface ITemplateChunk extends ITemplateChunkBase {
  followingVariableCategoryName?: string;
  variables?: IVariable[];
}

interface ITemplateChunkWithVariableCategory extends ITemplateChunkBase {
  followingVariableCategoryName: string;
  variables?: IVariable[];
}

export interface ITemplateForCreation {
  industries: IndustryType[];
  templateChunks: ITemplateChunk[];
}

const createTemplates = async (
  templates: ITemplateForCreation[],
  txn: Transaction,
) => {
  const templatePromises = templates.map(async template => {
    // (1) ensure that at least one industry was passed for the template
    await checkThatIndustriesArePassedIn(template);

    const TEMPLATE = await Template.create(txn);

    // (2) create IndustryTemplate instance for each passed in industry
    await createIndustryTemplates(template.industries, TEMPLATE, txn);

    // (3) create TemplateChunks
    return createTemplateChunks(TEMPLATE, template.templateChunks, txn);
  });
  return Promise.all(templatePromises);
};

const createTemplateChunks = async (
  createdTemplate: Template,
  templateChunks: ITemplateChunk[],
  txn: Transaction,
) => {
  const templateChunkPromises = templateChunks.map(
    async (templateChunk, index) => {
      if (templateChunk.followingVariableCategoryName) {
        return createTemplateChunkWithFollowingVariable(
          templateChunk as ITemplateChunkWithVariableCategory,
          index,
          createdTemplate,
          txn,
        );
      } else {
        const createdTemplateChunk = await TemplateChunk.create(
          {
            index,
            chunkText: templateChunk.chunkText,
            templateId: createdTemplate.id,
          },
          txn,
        );
        console.log(
          `[CREATE TEMPLATE SUCCESS]: TemplateChunk ${createdTemplateChunk.id} with chunkText ${templateChunk.chunkText} was created.`,
        );
        return createdTemplateChunk;
      }
    },
  );
  return Promise.all(templateChunkPromises);
};

const createTemplateChunkWithFollowingVariable = async (
  templateChunk: ITemplateChunkWithVariableCategory,
  index: number,
  createdTemplate: Template,
  txn: Transaction,
) => {
  const FOLLOWING_VARIABLE_CATEGORY = await getOrCreateVariableCategory(
    templateChunk.followingVariableCategoryName,
    txn,
  );

  const PREFERRED_VARIABLE = await createVariablesForVariableCategory(
    templateChunk.variables,
    FOLLOWING_VARIABLE_CATEGORY,
    txn,
  );

  // save and return the template chunk
  let templateChunkCreateFields: ITemplateChunkCreateFields = {
    index,
    chunkText: templateChunk.chunkText,
    templateId: createdTemplate.id,
    followingVariableCategoryId: FOLLOWING_VARIABLE_CATEGORY.id,
  };

  if (PREFERRED_VARIABLE) {
    templateChunkCreateFields = {
      ...templateChunkCreateFields,
      preferredVariableId: PREFERRED_VARIABLE.id,
    };
  }

  const createdTemplateChunk = await TemplateChunk.create(
    templateChunkCreateFields,
    txn,
  );
  console.log(
    `[CREATE TEMPLATE SUCCESS]: Created TemplateChunk ${createdTemplateChunk.id} with index ${index} for template ${createdTemplate.id}`,
  );

  return createdTemplateChunk;
};

const createVariablesForVariableCategory = async (
  templateChunkVariables: IVariable[] | undefined,
  followingVariableCategory: VariableCategory,
  txn: Transaction,
): Promise<Variable | undefined> => {
  let PREFERRED_VARIABLE;
  if (templateChunkVariables && templateChunkVariables.length) {
    for (const variable of templateChunkVariables) {
      const createdVariable = await Variable.create(
        {
          variableCategoryId: followingVariableCategory.id,
          variableText: variable.variableText,
        },
        txn,
      );
      console.log(
        `[CREATE TEMPLATE SUCCESS]: Created variable ${createdVariable.id} with variableText ${variable.variableText}`,
      );

      if (variable.isPreferred) {
        PREFERRED_VARIABLE = createdVariable;
      }
    }
  }
  return PREFERRED_VARIABLE;
};

const getOrCreateVariableCategory = async (
  categoryName: string,
  txn: Transaction,
): Promise<VariableCategory> => {
  const fetchedVariableCategory = await VariableCategory.getByName(
    categoryName,
    txn,
  );
  let variableCategory;

  if (fetchedVariableCategory) {
    variableCategory = fetchedVariableCategory;
  } else {
    variableCategory = await VariableCategory.create({ categoryName }, txn);
  }

  console.log(
    `[CREATE TEMPLATE SUCCESS]: fetched or created VariableCategory ${variableCategory.id}`,
  );
  return variableCategory;
};

const checkThatIndustriesArePassedIn = async (
  template: ITemplateForCreation,
) => {
  if (isEmpty(template.industries)) {
    return Promise.reject(
      `!! [CREATE TEMPLATE ERROR]: cannot create template ${JSON.stringify(
        template,
      )} if no industries are passed in.`,
    );
  }
  console.log(
    `[CREATE TEMPLATE SUCCESS]: creating template ${JSON.stringify(
      template,
    )} for industries ${JSON.stringify(template.industries)}`,
  );
};

const createIndustryTemplates = async (
  industries: IndustryType[],
  template: Template,
  txn: Transaction,
) => {
  const industryTemplatePromises = industries.map(async industry => {
    const INDUSTRY = await Industry.getByName(industry, txn);
    if (INDUSTRY) {
      const createdIndustryTemplate = await IndustryTemplate.create(
        { industryId: INDUSTRY.id, templateId: template.id },
        txn,
      );
      console.log(
        `[CREATE TEMPLATE SUCCESS]: created IndustryTemplate ${createdIndustryTemplate.id}`,
      );
      return createdIndustryTemplate;
    } else {
      return Promise.reject(
        `!! [CREATE TEMPLATE ERROR]: industry ${industry} does not exist in database.`,
      );
    }
  });
  return Promise.all(industryTemplatePromises);
};

export default createTemplates;
