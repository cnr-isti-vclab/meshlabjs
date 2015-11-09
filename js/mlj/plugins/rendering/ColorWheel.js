/**
 * The supported color modes are:
 *
 *   Uniform - color is per mesh, stored in the 'diffuse' uniform of the material
 *
 *   Attribute / per vertex - color is per vertex
 *
 *   Attribute / per face - color is per face (achieved by replicating vertices
 *       for each face)
 *
 * Rendering plugins that wantto interact with color modes need to include the
 * following uniform/attributes (managed by the framework) in the material and
 * shader definitions:
 *
 *   'diffuse' - uniform (vec3) - will encode the mesh color specified with the
 *       relative ColorWheel control
 *
 *   'VCGColor' - attribute (vec3) - will hold the primitive color according to
 *       the appropriate mode (per vertex or per face)
 *
 *   'meshColorMapping' - uniform int - must be used as a switch to instruct
 *       the shader whether to use the 'diffuse' uniform (0) or the incoming
 *       varying attribute (1) as base color
 *
 * The uniform variables will be updated by the framework, while the VCGColor
 * attribute is stored in the THREE.BufferGeometry object of the layer. See 
 * Layer.js as a use case of this plugin.
 */

var ColorMapping = {
    Uniform: 0,
    Attribute: 1
};

(function (plugin, core, scene) {

    var DEFAULTS = {
        diffuse: new THREE.Color('#A0A0A0'),
        meshColorMapping: ColorMapping.Uniform,
        colorMode: THREE.NoColors
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
                {content: "Uniform", value: THREE.NoColors, selected: true},
                {content: "Per Face", value: THREE.FaceColors},
                {content: "Per Vertex", value: THREE.VertexColors}
            ],
            bindTo: (function() {
                // Ugly, needs to update two entangled variables...
                var bindToFun = function (colorMode, overlay, colorParams) {
                    if (overlay.material.uniforms !== undefined
                            && overlay.material.uniforms.meshColorMapping !== undefined) {
                        // TODO use only 1 var
                        var colorMapping = (colorMode === THREE.NoColors) ? ColorMapping.Uniform : ColorMapping.Attribute;
                        overlay.material.uniforms.meshColorMapping.value = colorMapping;
                        colorParams.meshColorMapping = colorMapping;

                        var layer = scene.getSelectedLayer();
                        layer.updateMeshColorData(colorMode);
                    }
                };
                bindToFun.toString = function () { return "colorMode"; };
                return bindToFun;
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
