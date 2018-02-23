const fs = require('fs');
const find = require('find');
const limdu = require('limdu');

var intentClassifier = new limdu.classifiers.EnhancedClassifier({
  classifierType: limdu.classifiers.multilabel.BinaryRelevance.bind(0, {
    binaryClassifierType: limdu.classifiers.SvmJs.bind(0, {C: 1.0})
  }),
  normalizer: limdu.features.LowerCaseNormalizer,
  featureExtractor: limdu.features.NGramsOfWords(1),
  featureLookupTable: new limdu.features.FeatureLookupTable()
});

find.eachfile(/train.json$/, `${__dirname}/../../commands/`, (file) => {
  const dataset = JSON.parse(fs.readFileSync(file, {encoding: 'utf-8'}));

  intentClassifier.trainBatch(dataset);
  intentClassifier.retrain();
})

module.exports = (text, from) => {
  const commands = intentClassifier.classify(text);

  commands.forEach(command => {
    require(`../../commands/${command}`).run(text, from, commands);
  })
}
