/**
 * To support different color modes (uniform, per vertex or per face),
 * client plugins should query the value of the colorMode and meshColorMapping
 * parameters of 'ColorWheel'.
 *
 * 'colorMode' defines the value that should be assigned to the 'vertexColor'
 * attribute of a ThreeJS material (cfr. ThreeJS MeshBasicMaterial
 * documentation).
 * 
 * 'meshColorMapping' is a uniform that should be included in the shaders
 * to compute a color, depending on its value:
 *   0  color is per mesh, stored in the 'diffuse' uniform
 *   1  color is per vertex/face, stored in the 'color' vertex attribute of a
 *      vertex shader as vec3
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
            //bindTo: "meshColorMapping"
            bindTo: (function() {
                var bindToFun = function (colorMode, overlay, colorParams) {
                    if (overlay.material.uniforms !== undefined && overlay.material.uniforms.meshColorMapping !== undefined) {
                        overlay.material.uniforms.meshColorMapping.value = (colorMode === THREE.NoColors) ? ColorMapping.Uniform : ColorMapping.Attribute;

                        // update parameter variables to reflect the change,
                        // client plugins should only worry about this
                        colorParams.meshColorMapping = overlay.material.uniforms.meshColorMapping.value;

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
