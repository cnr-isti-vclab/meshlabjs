/**
 * The supported color modes are:
 *
 *   Uniform - color is per mesh, stored in the 'diffuse' uniform of the
 *       material
 *
 *   Face - color is per face (achieved by replicating vertices for each face)
 *
 *   Vertex - color is per vertex, interpolated across each face
 *
 * Rendering plugins that want to interact with color modes need to include the
 * following uniform/attributes (managed by the framework) in the material and
 * shader definitions:
 *
 *   'diffuse' - uniform (vec3) - will encode the mesh color specified with the
 *       relative ColorWheel control
 *
 *   'VCGColor' - attribute (vec3) - will hold the primitive color according to
 *       the appropriate mode (per vertex or per face)
 *
 *   'mljColorMode' - uniform int - must be used as a switch to instruct the
 *       shader whether to use the 'diffuse' uniform (if == 0) or the incoming
 *       varying attribute (if == 1 or == 2) as base color
 *
 * The uniform variables will be updated by the framework, while the VCGColor
 * attribute is stored in the THREE.BufferGeometry object of the layer. See 
 * Layer.js as a use case of this plugin.
 */

MLJ.ColorMode = {};

MLJ.ColorMode.Uniform = 0;
MLJ.ColorMode.Face    = 1;
MLJ.ColorMode.Vertex  = 2;

(function (plugin, core, scene) {

    var DEFAULTS = {
        diffuse: new THREE.Color('#A0A0A0'),
        mljColorMode: MLJ.ColorMode.Uniform
    };

    var plug = new plugin.Rendering({
        name: "ColorWheel",
        tooltip: "ColorWheel Tooltip",
        icon: "img/icons/color.png",
        global: true
    }, DEFAULTS);

    var albedoColor;
    var meshColorWidget;

    plug._init = function (guiBuilder) {

        albedoColor = guiBuilder.Color({
            label: "Albedo color",
            tooltip: "Diffuse color of the material",
            color: "#"+DEFAULTS.diffuse.getHexString(),
            bindTo: "diffuse"
        });
        meshColorWidget = guiBuilder.Choice({
            label: "Mesh Color",
            tooltip: "Choose one of the possible ways of displaying the color of the mesh",
            options: [
                {content: "Uniform", value: MLJ.ColorMode.Uniform, selected: true},
                {content: "Per Face", value: MLJ.ColorMode.Face},
                {content: "Per Vertex", value: MLJ.ColorMode.Vertex}
            ],
            bindTo: (function() {
                var callback = function (colorMode, overlay, layer) {
                    layer.updateThreeMesh(colorMode);
                };
                callback.toString = function () { return "mljColorMode"; };
                return callback;
            }())
        });
        

    };

    plug._applyTo = function (meshFile, on) {
//        if (defaults === true) {
//            meshFile.material.setColor(DEFAULTS.color.clone());
//        } else {
//            meshFile.material.setColor(albedoColor.getColor());
//        }
    };

    plugin.Manager.install(plug);

})(MLJ.core.plugin, MLJ.core, MLJ.core.Scene);
